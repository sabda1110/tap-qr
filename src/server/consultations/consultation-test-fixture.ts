import assert from "node:assert/strict";
import { mock } from "node:test";
import type { BookingRecord, ConsultationSlot } from "./consultation.types";
import { bookingInputSchema } from "./consultation.schemas";
import { expandSlots } from "./consultation-policy";

type Stored = Record<string, unknown>;
type Ref = { path: string; id: string; get: () => Promise<Snapshot>; set: (value: Stored) => Promise<void> };
type Snapshot = { ref: Ref; exists: boolean; id: string; data: () => Stored | undefined };
type QueryResult = { docs: Snapshot[] };
type Predicate = { field: string; operator: string; value: unknown };
type Query = { collection: string; predicates: Predicate[]; order?: [string, string]; maximum?: number;
  where: (field: string, operator: string, value: unknown) => Query;
  orderBy: (field: string, direction?: string) => Query;
  limit: (count: number) => Query; get: () => Promise<QueryResult>; doc: (id: string) => Ref };

const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
export const fixtureNow = Date.parse("2026-11-01T00:00:00.000Z");

/** Optimistic retries deliberately let concurrent callbacks read the same original snapshot. */
export function fakeConsultationFirestore(compositeError?: Error) {
  const documents = new Map<string, Stored>();
  const versions = new Map<string, number>();
  let revision = 0;
  let retries = 0;
  const clone = <T>(value: T): T => structuredClone(value);
  const persist = (path: string, value: Stored | null) => {
    if (value === null) documents.delete(path); else documents.set(path, clone(value));
    versions.set(path, ++revision);
  };
  const reference = (path: string): Ref => ({ path, id: path.split("/").at(-1)!,
    get: async () => snapshot(reference(path)), set: async (value) => persist(path, value) });
  const snapshot = (ref: Ref): Snapshot => {
    const value = clone(documents.get(ref.path));
    return { ref, exists: value !== undefined, id: ref.id, data: () => clone(value) };
  };
  const compare = (left: unknown, right: unknown) => String(left).localeCompare(String(right));
  const matches = (value: Stored, predicate: Predicate) => {
    const field = value[predicate.field];
    if (predicate.operator === "==") return field === predicate.value;
    if (predicate.operator === "<=") return compare(field, predicate.value) <= 0;
    if (predicate.operator === ">=") return compare(field, predicate.value) >= 0;
    throw new Error(`Unsupported fixture operator ${predicate.operator}`);
  };
  const querySnapshot = (query: Query): QueryResult => {
    if (compositeError && query.order && query.predicates.length) throw compositeError;
    let docs = [...documents.keys()].filter((path) => path.startsWith(`${query.collection}/`) && path.split("/").length === 2)
      .map((path) => snapshot(reference(path))).filter((doc) => query.predicates.every((predicate) => matches(doc.data()!, predicate)));
    if (query.order) {
      const [field, direction] = query.order;
      docs.sort((left, right) => compare(left.data()![field], right.data()![field]) * (direction === "desc" ? -1 : 1));
    }
    if (query.maximum !== undefined) docs = docs.slice(0, query.maximum);
    return { docs };
  };
  const query = (collection: string, predicates: Predicate[] = [], order?: [string, string], maximum?: number): Query => {
    const value: Query = { collection, predicates, order, maximum,
      where: (field, operator, match) => query(collection, [...predicates, { field, operator, value: match }], order, maximum),
      orderBy: (field, direction = "asc") => query(collection, predicates, [field, direction], maximum),
      limit: (count) => query(collection, predicates, order, count),
      doc: (id) => reference(`${collection}/${id}`), get: async () => querySnapshot(value) };
    return value;
  };
  type Transaction = {
    get: (target: Ref | Query) => Promise<Snapshot | QueryResult>;
    create: (ref: Ref, value: Stored) => void; set: (ref: Ref, value: Stored) => void;
    update: (ref: Ref, value: Stored) => void; delete: (ref: Ref) => void;
  };
  const db = { collection: query, runTransaction: async <T>(handler: (transaction: Transaction) => Promise<T>) => {
    for (let attempt = 0; attempt < 25; attempt++) {
      const reads = new Map<string, number>();
      const writes = new Map<string, Stored | null>();
      const creates = new Set<string>();
      let queryRevision: number | null = null;
      const result = await handler({
        get: async (target) => {
          assert.equal(writes.size, 0, "Firestore reads must precede writes");
          if ("path" in target) { reads.set(target.path, versions.get(target.path) ?? 0); return snapshot(target); }
          queryRevision = revision; return querySnapshot(target);
        },
        create: (ref, value) => { creates.add(ref.path); writes.set(ref.path, value); },
        set: (ref, value) => { writes.set(ref.path, value); },
        update: (ref, value) => { assert.ok(documents.has(ref.path)); writes.set(ref.path, { ...documents.get(ref.path), ...value }); },
        delete: (ref) => { writes.set(ref.path, null); },
      });
      if ([...reads].some(([path, version]) => (versions.get(path) ?? 0) !== version) || (queryRevision !== null && queryRevision !== revision)) {
        retries++; continue;
      }
      for (const path of creates) assert.equal(documents.has(path), false, "create requires a unique document");
      for (const [path, value] of writes) persist(path, value);
      return result;
    }
    throw new Error("Fixture transaction retry limit exceeded");
  } };
  return { db, documents, retries: () => retries };
}

export const bookingInput = (slotId: string, digit = "a", whatsapp = "081234567890") => bookingInputSchema.parse({
  slotId, statusToken: digit.repeat(64), cancelToken: `${digit}0`.repeat(32), name: "Test visitor", whatsapp,
});
export function seedSlots(fixture: ReturnType<typeof fakeConsultationFirestore>, date = "2026-11-02", times = ["10:00", "11:00", "13:00", "14:00"]) {
  return expandSlots([date], times, 0, 30).map((slot) => {
    const record: ConsultationSlot = { ...slot, status: "tersedia", bookingId: null, createdAt: new Date(fixtureNow).toISOString() };
    fixture.documents.set(`consultationSlots/${slot.id}`, { ...record });
    return record;
  });
}
export async function withConsultations(run: (context: ReturnType<typeof fakeConsultationFirestore> & {
  setTime: (time: number) => void; booking: (id: string) => BookingRecord;
}) => Promise<void>, compositeError?: Error) {
  const fixture = fakeConsultationFirestore(compositeError);
  let now = fixtureNow;
  const clock = mock.method(Date, "now", () => now);
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => fixture.db as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  try { await run({ ...fixture, setTime: (value) => { now = value; }, booking: (id) => fixture.documents.get(`consultationBookings/${id}`) as unknown as BookingRecord }); }
  finally { replacement.mock.restore(); clock.mock.restore(); }
}

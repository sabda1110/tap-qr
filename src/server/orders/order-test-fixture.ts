import assert from "node:assert/strict";

type Stored = Record<string, unknown>;
type Ref = { id: string; path: string; get: () => Promise<Snapshot>; collection: (name: string) => { doc: (id: string) => Ref } };
type Snapshot = { exists: boolean; id: string; data: () => Stored | undefined };

export function fakeOrderFirestore() {
  const documents = new Map<string, Stored>();
  const snapshot = (ref: Ref): Snapshot => ({ exists: documents.has(ref.path), id: ref.id, data: () => documents.get(ref.path) });
  const reference = (path: string, id: string): Ref => {
    const ref: Ref = { id, path, get: async () => snapshot(ref), collection: (name) => ({ doc: (child) => reference(`${path}/${name}/${child}`, child) }) };
    return ref;
  };
  const db = {
    collection: (collection: string) => ({ doc: (id: string) => reference(`${collection}/${id}`, id) }),
    runTransaction: async <T>(handler: (transaction: {
      get: (ref: Ref) => Promise<Snapshot>;
      create: (ref: Ref, value: Stored) => void;
      set: (ref: Ref, value: Stored) => void;
      update: (ref: Ref, value: Stored) => void;
    }) => Promise<T>) => {
      const staged = new Map<string, Stored>();
      const result = await handler({
        get: async (ref) => snapshot(ref),
        create: (ref, value) => { assert.equal(documents.has(ref.path), false); staged.set(ref.path, value); },
        set: (ref, value) => { staged.set(ref.path, value); },
        update: (ref, value) => { assert.equal(documents.has(ref.path), true); staged.set(ref.path, { ...documents.get(ref.path), ...value }); },
      });
      for (const [path, value] of staged) documents.set(path, value);
      return result;
    },
  };
  return { db, documents };
}

import assert from "node:assert/strict";
import { test } from "node:test";
import { singleFlight } from "./single-flight";

test("concurrent maintenance shares one pass; later requests still run fresh work", async () => {
  let passes = 0;
  let finish: (value: number) => void = () => { throw new Error("work not started"); };
  const run = singleFlight(() => {
    passes++;
    return new Promise<number>((resolve) => { finish = resolve; });
  });
  const first = run();
  const second = run();
  assert.equal(first, second);
  await Promise.resolve();
  assert.equal(passes, 1);
  finish(1);
  assert.deepEqual(await Promise.all([first, second]), [1, 1]);
  const next = run();
  await Promise.resolve();
  assert.equal(passes, 2);
  finish(2);
  assert.equal(await next, 2);
});

test("failed maintenance is not cached and synchronous errors can be retried", async () => {
  let passes = 0;
  const run = singleFlight(async () => {
    if (++passes === 1) throw new Error("temporarily unavailable");
    return "ready";
  });
  const first = run();
  const second = run();
  assert.equal(first, second);
  await assert.rejects(first, /temporarily unavailable/);
  assert.equal(await run(), "ready");
  assert.equal(passes, 2);
});

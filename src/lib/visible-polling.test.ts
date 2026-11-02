import assert from "node:assert/strict";
import { test } from "node:test";
import { startVisiblePolling } from "./visible-polling";

function pollingFixture(initial: DocumentVisibilityState) {
  const page = Object.assign(new EventTarget(), { visibilityState: initial });
  const callbacks = new Map<number, TimerHandler>();
  let nextId = 0;
  const timers = {
    setInterval(callback: TimerHandler) { const id = ++nextId; callbacks.set(id, callback); return id; },
    clearInterval(id?: number) { if (id !== undefined) callbacks.delete(id); },
  };
  return { page, callbacks, timers, change(visibility: DocumentVisibilityState) {
    page.visibilityState = visibility;
    page.dispatchEvent(new Event("visibilitychange"));
  } };
}

test("polling preserves loader data on mount, pauses when hidden, and refreshes on resume", () => {
  const fixture = pollingFixture("visible");
  let refreshed = 0;
  const stop = startVisiblePolling(() => { refreshed++; }, 25_000, fixture.page, fixture.timers);
  assert.equal(refreshed, 0, "do not duplicate the route's initial request");
  assert.equal(fixture.callbacks.size, 1);
  const tick = fixture.callbacks.values().next().value;
  assert.equal(typeof tick, "function");
  if (typeof tick === "function") tick();
  assert.equal(refreshed, 1);
  fixture.change("hidden");
  assert.equal(fixture.callbacks.size, 0);
  fixture.change("visible");
  assert.equal(refreshed, 2, "resume immediately rather than waiting another interval");
  assert.equal(fixture.callbacks.size, 1);
  stop();
  assert.equal(fixture.callbacks.size, 0);
  fixture.change("hidden"); fixture.change("visible");
  assert.equal(refreshed, 2, "unmounted pages must not refresh");
});

test("a page opened in a hidden tab waits for visibility before polling", () => {
  const fixture = pollingFixture("hidden");
  let refreshed = 0;
  const stop = startVisiblePolling(() => { refreshed++; }, 25_000, fixture.page, fixture.timers);
  assert.equal(fixture.callbacks.size, 0);
  fixture.change("visible");
  assert.equal(refreshed, 1);
  assert.equal(fixture.callbacks.size, 1);
  stop();
});

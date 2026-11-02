import assert from "node:assert/strict";
import { test } from "node:test";
import { loadMessages } from "./load-messages";

test("locale loads are shared per language and stay separate across locale switches", async () => {
  const firstId = loadMessages("id");
  assert.equal(loadMessages("id"), firstId);
  const firstEn = loadMessages("en");
  assert.notEqual(firstId, firstEn);
  const [id, en] = await Promise.all([firstId, firstEn]);
  assert.notEqual(id.header.login, en.header.login);
  assert.ok(id.adminDashboard.printStudio.themes.google.defaultHeadline);
  assert.ok(en.adminDashboard.printStudio.themes.google.defaultHeadline);
  assert.equal(await loadMessages("id"), id);
  assert.equal(await loadMessages("en"), en);
});

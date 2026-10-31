import assert from "node:assert/strict";
import { test } from "node:test";
import { outletProfileMetadata } from "./outlet-profile";
import { DEFAULT_SEO_ORIGIN } from "./pages";

const profile = {
  id: "outlet-123", slug: "kopi-contoh", name: "Kopi Contoh",
  description: "Deskripsi kartu", tagline: "Kopi dan roti setiap hari",
  location: "Jl. Contoh 12, Pekanbaru", avatarUrl: "https://example.com/logo.png",
};

test("public profile uses its visible business content, canonical slug and actual logo", () => {
  const head = outletProfileMetadata(DEFAULT_SEO_ORIGIN, "id", profile);
  assert.ok(head.meta.some((meta) => "title" in meta && meta.title === "Kopi Contoh — Kopi dan roti setiap hari | TapQR"));
  assert.ok(head.meta.some((meta) => meta.name === "description" && meta.content.includes(profile.location)));
  assert.ok(head.meta.some((meta) => "property" in meta && meta.property === "og:image" && meta.content === profile.avatarUrl));
  assert.ok(!head.meta.some((meta) => "property" in meta && ["og:image:width", "og:image:height", "og:image:type"].includes(meta.property ?? "")));
  assert.equal(head.links.find((link) => link.rel === "canonical")?.href, "https://www.tapqr.id/id/p/kopi-contoh");
  assert.equal(head.links.filter((link) => link.rel === "alternate").length, 3);
  const graph = JSON.parse(head.scripts[0].children)["@graph"];
  assert.equal(graph[0]["@type"], "LocalBusiness");
  assert.equal(graph[0].address.streetAddress, profile.location);
  assert.equal(graph[0].description, profile.tagline);
  assert.equal(graph[1].mainEntity["@id"], graph[0]["@id"]);
});

test("profile fallback omits invented business facts and private properties", () => {
  const input = { ...profile, tagline: null, description: null, location: "", avatarUrl: "javascript:alert(1)",
    ownerId: "private-owner", email: "private@example.com", phone: "private-phone", wifiPassword: "private-wifi" };
  const head = outletProfileMetadata(DEFAULT_SEO_ORIGIN, "en", input);
  const serialized = JSON.stringify(head);
  assert.match(serialized, /Find business information/);
  assert.match(serialized, /tapqr-social.webp/);
  assert.doesNotMatch(serialized, /javascript:|private-owner|private@example.com|private-phone|private-wifi|openingHours|aggregateRating/);
  const business = JSON.parse(head.scripts[0].children)["@graph"][0];
  assert.equal(business["@type"], "Organization");
  assert.ok(!("address" in business));
  assert.ok(!("logo" in business));
});

test("profile metadata escapes JSON-LD, bounds text and rejects credential-bearing images", () => {
  const input = { ...profile, slug: "", name: "</script><script>alert(1)</script>",
    tagline: "Kopi segar ".repeat(100), avatarUrl: "https://user:secret@example.com/logo.png" };
  const head = outletProfileMetadata(DEFAULT_SEO_ORIGIN, "id", input);
  assert.doesNotMatch(head.scripts[0].children, /<script|<\/script>/);
  assert.doesNotMatch(JSON.stringify(head), /user:secret/);
  const description = head.meta.find((meta) => meta.name === "description");
  assert.ok(description?.content && description.content.length <= 200);
  assert.ok(head.links.some((link) => link.rel === "canonical" && link.href.endsWith("/p/outlet-123")));
});

test("missing profiles have no canonical to the homepage and staging profiles remain noindex", () => {
  for (const input of [null, { ...profile, name: "  " }]) {
    const head = outletProfileMetadata(DEFAULT_SEO_ORIGIN, "id", input);
    assert.ok(head.meta.some((meta) => meta.name === "robots" && meta.content.startsWith("noindex")));
    assert.equal(head.links.length, 0);
    assert.equal(head.scripts.length, 0);
  }
  const head = outletProfileMetadata(DEFAULT_SEO_ORIGIN, "en", profile, true);
  assert.ok(head.meta.some((meta) => meta.name === "robots" && meta.content.startsWith("noindex")));
});

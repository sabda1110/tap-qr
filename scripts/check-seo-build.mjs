import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { readdir } from "node:fs/promises";

// Exercise the compiled HTTP handler in-process, without a browser, TCP port or Firebase writes.
let app;
globalThis.__srvxLoader__ = ({ server }) => { app = server; };
await import(pathToFileURL(resolve(".output/server/index.mjs")).href);
delete globalThis.__srvxLoader__;
assert.ok(app?.fetch, "Run npm run build before this check");

async function request(path) {
  const response = await app.fetch(new Request(`https://www.tapqr.id${path}`, { signal: AbortSignal.timeout(10_000) }));
  assert.equal(response.status, 200, `${path} must return 200`);
  return { response, body: await response.text() };
}
const sitemap = await request("/sitemap.xml");
assert.match(sitemap.response.headers.get("content-type") ?? "", /application\/xml/);
assert.equal([...sitemap.body.matchAll(/<loc>/g)].length, 8);
assert.doesNotMatch(sitemap.body, /dashboard|\/orders\/|TQR-/);
const robots = await request("/robots.txt");
assert.match(robots.body, /Sitemap: https:\/\/www.tapqr.id\/sitemap.xml/);
const image = await app.fetch(new Request("https://www.tapqr.id/tapqr-social.webp"));
assert.equal(image.status, 200);
assert.match(image.headers.get("content-type") ?? "", /image\/webp/);
// Preserve and validate any owner-provided Search Console HTML verification file.
for (const file of (await readdir("public")).filter((file) => /^google[a-f0-9]+\.html$/.test(file))) {
  const { body } = await request(`/${file}`);
  assert.ok(body.includes(`google-site-verification: ${file}`));
}

for (const path of ["/id", "/en", "/id/tutorial/activation", "/en/tutorial/google-place-id"]) {
  const { body } = await request(path);
  const head = body.slice(0, body.indexOf("</head>"));
  assert.match(head, /name="google-site-verification" content="s89d2JcWJ9yMygTWR00ELWiZQuHzQ2vpKIfAgokmiY8"/);
  const canonical = head.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0] ?? "";
  assert.ok(canonical.includes(`href="https://www.tapqr.id${path}"`), `${path} canonical must be in server HTML`);
  assert.match(head, /name="robots" content="index, follow, max-image-preview:large"/);
  assert.doesNotMatch(head, /name="robots" content="noindex/);
  assert.match(head, /hreflang="id"/i);
  assert.match(head, /hreflang="en"/i);
  assert.match(head, /type="application\/ld\+json"/);
  const jsonLd = [...head.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)];
  assert.ok(jsonLd.length);
  for (const match of jsonLd) assert.equal(JSON.parse(match[1])["@context"], "https://schema.org");
  assert.ok(body.includes(`<html lang="${path.startsWith("/en") ? "en" : "id"}">`));
}
const login = await request("/id/auth/login");
assert.match(login.body.slice(0, login.body.indexOf("</head>")), /name="robots" content="noindex, nofollow, noarchive"/);
console.log("SEO build checks passed: sitemap, robots, localized server HTML, canonical, hreflang, JSON-LD and private noindex.");

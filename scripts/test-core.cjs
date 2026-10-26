// Reuse the in-memory TypeScript loader and existing order regression suite.
require("./test-orders.cjs");
require("../src/lib/validation/checkout-search.test.ts");
require("../src/lib/print-dimensions.test.ts");
require("../src/server/analytics/public-event-limiter.server.test.ts");
require("../src/server/analytics/admin-analytics.repository.server.test.ts");
require("../src/server/outlets/public-profile.repository.server.test.ts");

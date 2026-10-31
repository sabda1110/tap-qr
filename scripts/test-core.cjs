// Reuse the in-memory TypeScript loader and existing order regression suite.
require("./test-orders.cjs");
require("../src/lib/validation/checkout-search.test.ts");
require("../src/lib/print-dimensions.test.ts");
require("../src/lib/studio-print-job.test.ts");
require("../src/lib/seo/seo.test.ts");
require("../src/lib/seo/outlet-profile.test.ts");
require("../src/server/print/admin-print.repository.server.test.ts");
require("../src/server/analytics/public-event-limiter.server.test.ts");
require("../src/server/analytics/admin-analytics.repository.server.test.ts");
require("../src/server/outlets/public-profile.repository.server.test.ts");
require("../src/server/consultations/consultation.repository.server.test.ts");
require("../src/server/consultations/consultation-notifications.server.test.ts");
require("../src/server/consultations/consultation-query.repository.server.test.ts");
require("../src/lib/consultation-slot-draft.test.ts");
require("../src/lib/consultation-admin-view.test.ts");
require("../src/server/consultations/consultation-slot-delete.repository.server.test.ts");

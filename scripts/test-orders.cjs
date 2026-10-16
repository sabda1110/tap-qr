const ts = require("typescript");
const fs = require("node:fs");

// Compile only in memory so domain tests can run on the project's Node 20 runtime.
require.extensions[".ts"] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  module._compile(compiled.outputText, filename);
};

require("../src/server/orders/order.schemas.test.ts");
require("../src/server/orders/order.repository.server.test.ts");
require("../src/server/orders/phone-order.repository.server.test.ts");
require("../src/server/orders/order-list.repository.server.test.ts");
require("../src/server/orders/order-management.repository.server.test.ts");

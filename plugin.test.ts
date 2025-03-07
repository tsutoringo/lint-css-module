import { assertEquals } from "jsr:@std/assert";
import plugin from "./plugin.ts";

Deno.test("css-modules/css-module-type#no-type-directive", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.ts", // Dummy filename, file doesn't need to exist.
    'import style from "./component.module.css"',
  );

  assertEquals(diagnostics.length, 1);
  const d = diagnostics[0];
  assertEquals(d.id, "css-modules/css-module-type");
  assertEquals(d.fix, [{
    range: [0, 0],
    text: '// @ts-types="./component.module.css.d.ts"\n',
  }]);
});

Deno.test("css-modules/css-module-type#any-indent", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.ts", // Dummy filename, file doesn't need to exist.
    '  import style from "./component.module.css"',
  );

  assertEquals(diagnostics.length, 1);
  const d = diagnostics[0];
  assertEquals(d.id, "css-modules/css-module-type");
  assertEquals(d.fix, [{
    range: [2, 2],
    text: '// @ts-types="./component.module.css.d.ts"\n  ',
  }]);
});

Deno.test("css-modules/css-module-type#single-comment-type-directive", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.ts", // Dummy filename, file doesn't need to exist.
    '// @ts-types="./component.module.css.d.ts"\nimport style from "./component.module.css"',
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("css-modules/css-module-type#multi-comment-type-directive", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.ts", // Dummy filename, file doesn't need to exist.
    '/* @ts-types="./component.module.css.d.ts" */\nimport style from "./component.module.css"',
  );

  assertEquals(diagnostics.length, 0);
});

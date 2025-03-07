import { getImportDeclarationAttr, getLineBreak } from "./helper.ts";

export default {
  name: "css-modules",
  rules: {
    "css-module-type": {
      create(context) {
        return {
          ImportDeclaration(node) {
            const cssModuleExtRegExp = /.module.(css|scss|sass|less)$/;
            if (!cssModuleExtRegExp.test(node.source.value)) return;

            const importDeclarationAttr = getImportDeclarationAttr(
              context,
              node,
            );
            if (importDeclarationAttr.hasTsTypeDirective()) return;

            const lineBreak = getLineBreak(context.sourceCode.text);
            const indent =
              importDeclarationAttr.betweenPreviousStatement.split(lineBreak)
                .at(-1) ?? "";
            const quote = node.source.raw[0];
            const typeCommentDirective = "// @ts-types=" + quote +
              node.source.value + ".d.ts" + quote;

            return context.report({
              message: "This css module import needs @ts-type directive.",
              hint: "Add `" + typeCommentDirective + "` on top of import",
              fix(fixer) {
                return fixer.insertTextBefore(
                  node,
                  typeCommentDirective + lineBreak + indent,
                );
              },
              range: node.range,
            });
          },
        };
      },
    },
  },
} as Deno.lint.Plugin;

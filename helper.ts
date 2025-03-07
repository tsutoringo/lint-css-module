import { flatten } from "@core/iterutil";
import { map, some } from "@core/iterutil/pipe";
import { pipe } from "@core/pipe";

export const getParentNode = (
  context: Deno.lint.RuleContext,
  node: Deno.lint.Node,
): Deno.lint.Node | null => {
  const ancestors = context.sourceCode.getAncestors(node);
  return ancestors[ancestors.length - 1] ?? null;
};

export const getStatementBody = (
  node: Deno.lint.Node,
): Deno.lint.Statement[] | null => {
  switch (node.type) {
    case "Program":
    case "BlockStatement":
      return node.body;
  }

  return null;
};

export const getOffsetStatement = (
  context: Deno.lint.RuleContext,
  statement: Deno.lint.Statement,
  offset: number,
): Deno.lint.Statement | null => {
  const parent = getParentNode(context, statement);
  if (!parent) return null;

  const body = getStatementBody(parent);
  if (!body) return null;

  const index = body.findIndex((entry) => entry === statement);
  if (index === -1) return null;

  const targetIndex = index + offset;

  return body[targetIndex] ?? null;
};

export const getBetweenPreviousStatement = (
  context: Deno.lint.RuleContext,
  statement: Deno.lint.Statement,
): string => {
  const beforeStatement = getOffsetStatement(context, statement, -1);

  const rangeStart = beforeStatement?.range[1] ?? 0;

  return context.sourceCode.text.slice(rangeStart, statement.range[0]);
};

export const getComments = (sourceCode: string): Iterable<string> => {
  const commentRegExp = /\/\/.*|\/\*[\s\S]*?\*\//g;
  return flatten<string>(sourceCode.matchAll(commentRegExp));
};

export const getImportDeclarationAttr = (
  context: Deno.lint.RuleContext,
  importDeclaration: Deno.lint.ImportDeclaration,
) => {
  const tsTypeRegExp = /\s*@ts-types\s*=\s*["']([^"']+)["']/;
  const betweenPreviousStatement = getBetweenPreviousStatement(
    context,
    importDeclaration,
  );
  const comments = getComments(betweenPreviousStatement);

  return {
    betweenPreviousStatement,
    hasTsTypeDirective: () =>
      pipe(
        comments,
        map((comment) => tsTypeRegExp.test(comment)),
        some((entry) => entry),
      ),
  };
};

export const getLineBreak = (text: string) => {
  return text.match("\r?\n")?.[0].startsWith("\r") ? "\r\n" : "\n";
};

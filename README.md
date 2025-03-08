[![JSR](https://jsr.io/badges/@tsutoringo/lint-css-modules)](https://jsr.io/@tsutoringo/lint-css-modules)
[![JSR](https://jsr.io/badges/@tsutoringo/lint-css-modules/score)](https://jsr.io/@tsutoringo/lint-css-modules)

# lint-css-module

Deno lint plugin that disable not typed css module

## ❌ Invalid Examples

```typescript
import styles from "./component.module.css";
```

```
error[css-modules/css-module-type]: This css module import needs @ts-type directive.
 --> main.tsx:0:0
  | 
1 | import styles from "./component.module.css";
  | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  = hint: Add `// @ts-types="./component.module.css.d.ts"` on top of import
```

## ✅ Valid Examples

```typescript
// @ts-types="./component.module.css.d.ts"
import styles from "./component.module.css";
```

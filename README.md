# lint-css-module
Deno lint plugin that disable not typed css module

## ❌ Invalid Examples
```typescript
import styles from "./componet.module.css";
```

```
error[css-modules/css-module-type]: This css module import needs @ts-type directive.
 --> main.tsx:0:0
  | 
1 | import styles from "./componet.module.css";
  | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  = hint: Add `// @ts-types="./componet.module.css.d.ts"` on top of import
```

## ✅ Valid Examples
```typescript
// @ts-types="./componet.module.css.d.ts"
import styles from "./componet.module.css";
```

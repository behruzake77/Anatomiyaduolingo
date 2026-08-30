---
name: Vite JSX metadata transform
description: A Replit Vite metadata-transform quirk affecting generic JSX component syntax.
---

When the Replit Vite metadata transform is active, generic JSX component calls such as `<Component<Type>>` can be rewritten into invalid JSX before Babel parses them. Prefer inference from props or a typed handler cast at the call site.

**Why:** The transform inserts component metadata into the opening tag and can place it between the component name and its type parameter.

**How to apply:** If a TSX file reports an unexpected token around a generic component opening tag, remove the JSX generic parameter, let props infer the value type where possible, and cast the callback value only when necessary.
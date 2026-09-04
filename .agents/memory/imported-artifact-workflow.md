---
name: Imported artifact workflow
description: Preview and workflow behavior after importing an existing web app into Replit
---

For an imported web app, `.replit-artifact/artifact.toml` can exist before the artifact is registered. Registering the existing metadata enables the artifact preview, but may add a managed workflow alongside an older import-created workflow.

**Why:** Both workflows can target the same configured port, causing the managed service to fail with “Port ... is already in use” even though the old preview is healthy.

**How to apply:** Check the artifact registry and workflow list after import. If a duplicate legacy workflow exists, stop it and run the managed `artifacts/<slug>: web` workflow instead of creating another workflow.
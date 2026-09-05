---
name: Preview WebGL fallback
description: The hosted preview can lack a WebGL context even when the app build is healthy.
---

Use a graceful non-WebGL visual fallback for Three.js scenes in this project.

**Why:** The Replit browser preview may not expose a usable WebGL context, so constructing a renderer without a capability check can crash the React tree.

**How to apply:** Probe for WebGL before creating `THREE.WebGLRenderer`; keep the interactive canvas fallback mounted when unsupported so previews stay usable.
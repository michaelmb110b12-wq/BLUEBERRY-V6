# Blueberry GhostLink — Hostless + Bunny fallback v8

This package keeps the upstream GhostLink browser and the Blueberry changes.

Changes:
- GN-Math / Games is renamed **Cine Cloud** and uses the Steam-style icon.
- Cine Cloud opens `https://michaelmb110b12-wq.github.io/Cine-Cloud-SRC/src/` through GhostLink's existing browser flow.
- Discord and the old GhostLink GitHub social buttons both point to `https://github.com/michaelmb110b12-wq`.
- Hostless runs the browser UI plus a local Wisp server at `/wisp/` using `@mercuryworkshop/wisp-js/server` 0.5.0.
- The frontend can use the same-origin Hostless Wisp endpoint and extra endpoints listed by `bunny-config.js` when served from Bunny.
- v8 fixes the previous malformed HTML issue by inserting the Wisp configuration as JavaScript inside GhostLink's existing script block instead of nesting a second `<script>` element. This prevents the browser from rendering JavaScript source as visible page text.

## Hostless

Use **Docker** with the repository root as the build context. Start command:

```text
node server.mjs
```

Hostless supplies `HOST` and `PORT`; the server binds to those values. The included `/health` endpoint is suitable for an HTTP health check.

## Bunny CDN mirror

Upload the generated public files (`index.html`, `sw.js`, `bareworker.js`, and `bunny-config.js`) to your Bunny Pull Zone.

After your Hostless app has a URL, edit `bunny-config.js`:

```js
window.BLUEBERRY_WISP_FALLBACKS = [
  "wss://YOUR-HOSTLESS-APP.hostless.app/wisp/"
];
```

Then purge the Bunny cache.

## Upstream

Base project: https://github.com/virtuan4-max/ghostlinkhub

The upstream project and its own license/notices should remain credited when you redistribute the built app.

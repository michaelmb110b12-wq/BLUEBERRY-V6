# Blueberry GhostLink — Hostless + Bunny fallback

This package keeps the upstream GhostLink browser and the Blueberry changes.

Build fix: the Wisp server dependency is pinned to the currently published `@mercuryworkshop/wisp-js` 0.5.0; the previous 1.3.0 pin does not exist on npm.

- GN-Math / Games is renamed **Cine Cloud** and uses the Steam-style icon.
- Cine Cloud opens `https://michaelmb110b12-wq.github.io/Cine-Cloud-SRC/src/` through GhostLink's existing browser flow.
- Discord and the old GhostLink GitHub social buttons both point to `https://github.com/michaelmb110b12-wq`.
- Hostless runs the browser UI plus a local Wisp server at `/wisp/` using the maintained `@mercuryworkshop/wisp-js/server` package.
- The frontend prefers the same-origin Hostless Wisp endpoint when it is served from Hostless.
- The frontend also supports extra Wisp fallback URLs supplied through `bunny-config.js` when the UI is served from Bunny.

## Hostless

Use **Docker** with the repository root as the build context. Leave the start command as:

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

Then purge the Bunny cache. This keeps Bunny as the static/frontend host while Hostless provides the Wisp backend.

The fallback list is a normal availability feature: if the primary configured Wisp endpoint is unavailable, GhostLink can try its configured alternatives. It is not intended to bypass a network's access controls.

## Upstream

Base project: https://github.com/virtuan4-max/ghostlinkhub

The upstream project and its own license/notices should remain credited when you redistribute the built app.

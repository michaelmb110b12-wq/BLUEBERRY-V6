# Blueberry Scramjet — Hostless

This repository is a minimal deployment wrapper around the current
[MercuryWorkshop/Scramjet-App](https://github.com/MercuryWorkshop/Scramjet-App).

The default homepage remains the upstream Scramjet app and uses its normal
Scramjet client and same-origin `/wisp/` endpoint. This branch adds two
extras:

- A Steam-logo shortcut that fills the Scramjet address form with
  `https://nocturne.lol/`.
- A **Relay Loader** shortcut that opens `/loader.html`, an experimental
  page based on the provided remote-`loader.js` example.

## About `/loader.html`

The relay loader is **not Scramjet and does not use this app's Wisp endpoint**.
It downloads a pinned revision of
[TongSherbet/im-single](https://github.com/TongSherbet/im-single/tree/e1d1b416859fed1e25e810ee78893951ac9cdda4),
then that script fetches its relay list and tries third-party relay pages.
Those relay services are separately operated, may be unavailable, and may
observe connection metadata or browsing activity. Review the linked source and
only use relay services you trust. The page requires the user to click **Load
relay browser** before the remote script runs.

Because the relay page relies on external CDNs and relay hosts, availability is
not guaranteed. This feature is intentionally separate from the standard
Scramjet/Wisp path.

## Deploy on Hostless

1. In Hostless, choose **Create New App**.
2. Connect GitHub and select this repository.
3. Select **Docker** as the build system.
4. Leave the start command empty because the Dockerfile already uses
   `pnpm start`.
5. Deploy the `loaderjs-relay` branch to test the experimental route.

Hostless sets the `PORT` environment variable for the app. The upstream
Scramjet-App already listens on `process.env.PORT` (defaulting to 8080), so
the server does not need a port change.

## Important

Scramjet describes itself as an experimental interception-based web proxy.
Review its license, supported-site guidance, and acceptable-use requirements
before operating a public instance. Proxy use can consume significant resources.

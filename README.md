# DO NOT FORK Blueberry Scramjet — Hostless

This repository is a minimal deployment wrapper around the current
[MercuryWorkshop/Scramjet-App](https://github.com/MercuryWorkshop/Scramjet-App).

The wrapper makes **one user-facing change only**: it adds a small Steam-logo button
that fills the existing Scramjet address form with:


The button uses the upstream form-submit flow, so the target opens through the
same Scramjet instance and its local `/wisp/` endpoint.

## Deploy on Hostless

Hostless can deploy long-running Node.js web services from a Git repository and
sets the `PORT` environment variable for the app. The upstream Scramjet-App
already listens on `process.env.PORT` (defaulting to 8080), so no source changes
to the server are needed.

1. Put these files in a GitHub repository.
2. In Hostless, choose **Create New App**.
3. Connect your GitHub account and select the repository.
4. Select **Docker** as the build system.
5. You can leave the start command empty because the Dockerfile already uses
   `pnpm start`.
6. Deploy.

Hostless documents that its free plan includes one always-on app with no cold
starts and no credit card requirement. Its current free resource limits are
account-wide 0.5 vCPU and 1 GiB RAM, with each app process capped at 256 MiB.
See the Hostless pricing documentation before deploying a public proxy because
Scramjet traffic can use significant resources.

## Important

The upstream project describes Scramjet as an experimental web proxy. Review
its license, supported-site guidance, and acceptable-use requirements before
running a public instance.

This wrapper does not include a copy of the upstream repository; the Docker
build pulls the current `main` branch, applies the one shortcut patch, then runs
that upstream app unchanged.

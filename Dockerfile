FROM node:20-bookworm-slim

ENV NODE_ENV=production
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pull the upstream MercuryWorkshop Scramjet-App at build time.
RUN git clone --depth 1 https://github.com/MercuryWorkshop/Scramjet-App.git /app

COPY patch-scramjet.mjs /tmp/patch-scramjet.mjs
RUN node /tmp/patch-scramjet.mjs /app/public/index.html && rm /tmp/patch-scramjet.mjs

RUN corepack enable \
    && corepack prepare pnpm@10.18.3 --activate \
    && pnpm install --frozen-lockfile --prod

EXPOSE 8080

CMD ["pnpm", "start"]

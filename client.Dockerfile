FROM oven/bun:debian AS builder

WORKDIR /app

COPY ./package.json ./bun.lockb /app/
COPY ./apps/ /app/apps
COPY ./packages /app/packages
COPY ./drizzle/ /app/drizzle

RUN bun i --frozen-lockfile

RUN timeout --preserve-status 20s bun run build:database || true
RUN timeout --preserve-status 20s bun run build:server || true
RUN bun run build:client

FROM caddy:2 AS client

COPY ./Caddyfile /etc/caddy/

COPY --from=builder /app/apps/client/dist /usr/share/caddy

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]

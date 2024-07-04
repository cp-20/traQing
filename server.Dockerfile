FROM oven/bun:debian AS server

WORKDIR /app

# Install procps for ps command
RUN apt-get update && apt-get install -y procps && apt-get clean

COPY ./package.json ./bun.lockb /app/
COPY ./apps /app/apps
COPY ./packages /app/packages
COPY ./drizzle/ /app/drizzle

RUN bun i --frozen-lockfile

RUN timeout --preserve-status 20s bun run build:database || true

EXPOSE 8080

CMD ["bun", "run", "start:server"]

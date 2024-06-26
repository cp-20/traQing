FROM oven/bun:debian

WORKDIR /app

COPY . /app

RUN bun i --frozen-lockfile

RUN timeout --preserve-status 20s bun run build:database || true
RUN timeout --preserve-status 20s bun run build:server || true
RUN bun run build:client

# Install procps for ps command
RUN apt-get update && apt-get install -y procps && apt-get clean

CMD ["bun", "run", "start"]

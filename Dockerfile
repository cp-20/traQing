FROM oven/bun:slim

WORKDIR /app
COPY . /app

RUN bun i
RUN bun run build:client

CMD ["bun", "run", "start"]
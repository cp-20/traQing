FROM oven/bun:slim

WORKDIR /app

COPY ./package.json ./bun.lockb /app/

RUN bun i

COPY . /app

RUN bun run build:client

CMD ["bun", "run", "start"]
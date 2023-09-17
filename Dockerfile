FROM oven/bun
WORKDIR /app
COPY . .
RUN bun build --target=bun ./src/index.ts --outfile=run.js
ENTRYPOINT ["bun", "run", "./run.js"]
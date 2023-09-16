FROM oven/bun
WORKDIR /app
COPY . .
RUN bun build --target=bun ./src/index.ts --outfile=run.js
CMD bun run ./run.js
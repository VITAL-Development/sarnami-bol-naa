# Minimal production image for the Sarnami Bol Naa backend (issue #49).
#
# /server is dependency-free (see README.md — no runtime or dev
# dependencies, not even for tests: everything is `node:*` standard
# library), so there is no `node_modules` to install or copy. This is a
# single stage that just copies the runtime files onto a slim Node base
# image matching the Node version used elsewhere in this project's CI
# (see .github/workflows/ci.yml).
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY server.mjs content.mjs gamification.mjs stub-data.mjs ./
COPY content ./content
COPY settings ./settings

# Runs as the non-root `node` user baked into the official image instead of
# root.
USER node

EXPOSE 8787

CMD ["node", "server.mjs"]

# --- STAGE 1: BASE ---
# Setup OS and Package Manager (pnpm)
FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm AS base

# Install system deps for native modules (sharp, etc.)
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
    git curl ca-certificates openssl bash-completion \
    python3 make g++ libvips-dev \
    && apt-get clean

# Setup pnpm 11.x
RUN npm uninstall -g pnpm || true \
    && corepack enable \
    && corepack prepare pnpm@11.0.6 --activate

# FIX: Added the /bin suffix to the PATH so pnpm can find its own executables
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"
ENV CI=1

# --- STAGE 2: BUILDER ---
FROM base AS builder
WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

RUN --mount=type=cache,id=pnpm,target=/home/node/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

COPY . .
RUN pnpm run auth:generate
RUN pnpm run build

# --- STAGE 3: DEV ---
FROM base AS dev
WORKDIR /workspaces

# FIX: Set permissions and switch to 'node' user BEFORE installing global tools
# This ensures pnpm installs into the node user's home directory correctly
RUN chown -R node:node /workspaces
USER node
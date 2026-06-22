# syntax=docker/dockerfile:1

# ---- Build stage: compile the static bundle ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies against the lockfile for reproducible builds.
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build. BUILD_MODE selects which .env.<mode> file Vite loads.
COPY . .
ARG BUILD_MODE=production
RUN npm run build -- --mode "${BUILD_MODE}"

# ---- Production stage: serve the bundle with nginx ----
FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

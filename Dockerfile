# =========================
# STAGE 1: Build Frontend
# =========================
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

# Copy and build frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# =========================
# STAGE 2: Build Backend
# =========================
FROM node:22-alpine AS backend

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

# Copy built frontend (from stage 1) into backend's public folder
RUN mkdir -p public
COPY --from=frontend-build /frontend/dist ./public

# =========================
# Environment Configuration
# =========================
ENV NODE_ENV=production
ENV PORT=5000
ENV PGUSER=postgres
ENV PGPASSWORD=123456
ENV PGHOST=host.docker.internal
ENV PGDATABASE=asl1_db
ENV PGPORT=5432

# Expose backend port
EXPOSE 5000

# =========================
# Run the backend server
# =========================
CMD ["node", "server.js"]

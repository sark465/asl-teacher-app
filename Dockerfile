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

# Copy built frontend files into backend/public
RUN mkdir -p public
COPY --from=frontend-build /frontend/dist ./public

# =========================
# Environment Config
# =========================
ENV PGUSER=postgres
ENV PGPASSWORD=123456
ENV PGHOST=host.docker.internal
ENV PGDATABASE=asl1_db
ENV PGPORT=5432

EXPOSE 5000

# =========================
# Run the backend server
# =========================
CMD ["node", "server.js"]

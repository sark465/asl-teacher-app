# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Run
FROM node:22-alpine

WORKDIR /app
COPY --from=build /app .

# Environment variables (can also use .env file)
ENV PORT=5000
ENV PGUSER=postgres
ENV PGPASSWORD=your_password
ENV PGHOST=db
ENV PGDATABASE=asl1_db
ENV PGPORT=5432

EXPOSE 5000

CMD ["node", "server.js"]

# ---------- Use Node 20 LTS ----------
FROM node:20

# Install build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++

# ---------- SERVER ----------
WORKDIR /app/server

# Copy server package.json & install dependencies
COPY server/package*.json ./
RUN npm install

# Copy server source code
COPY server ./

# ---------- CLIENT ----------
WORKDIR /app/client

# Copy client package.json & install dependencies
COPY client/package*.json ./
RUN npm install

# Copy client source code
COPY client ./

# ---------- FRONTEND BUILD ----------
# Pass only VITE_ variables to frontend build
ARG VITE_WEATHER_API_KEY
ARG VITE_BACKEND_DOMAIN
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY
ENV VITE_BACKEND_DOMAIN=$VITE_BACKEND_DOMAIN

# Build frontend (Vite)
RUN npm run build

# ---------- FINAL SETUP ----------
WORKDIR /app
EXPOSE 8080

# Run server (Railway injects all backend env variables at runtime)
CMD ["node", "server/app.js"]

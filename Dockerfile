# ---------- Use Node 20 LTS for Vite ----------
FROM node:20

# Install build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++

# ---------- SERVER ----------
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server ./

# ---------- CLIENT ----------
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client ./

# ---------- Build frontend ----------
# Pass secrets as build arguments (must start with VITE_ for Vite)
ARG VITE_WEATHER_API_KEY
ARG VITE_BACKEND_DOMAIN
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY
ENV VITE_BACKEND_DOMAIN=$VITE_BACKEND_DOMAIN

RUN npm run build

# ---------- FINAL SETUP ----------
WORKDIR /app
EXPOSE 8080

# Pass server secrets at runtime via environment variables
# Example (for Railway, Heroku, or docker run -e):
# MONGODB_URL, EMAIL_SECRET, EMAIL, EMAIL_PASS, LOGIN_PASS, EMAIL_SECRET_FORGET, FRONTEND_DOMAIN
CMD ["node", "server/app.js"]

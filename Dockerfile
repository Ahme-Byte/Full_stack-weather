# Use Node 20 (modern React/Vite support)
FROM node:20

# Install build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++

# App root
WORKDIR /app

# ---------- SERVER ----------
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server . .

# ---------- CLIENT ----------
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client . .
RUN npm run build   # Vite outputs to 'dist'

# ---------- START BACKEND ----------
WORKDIR /app
EXPOSE 8080
CMD ["node", "server/app.js"]
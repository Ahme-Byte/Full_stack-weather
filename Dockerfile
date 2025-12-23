
# New example: Node 18 LTS
FROM node:18

# Install build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++

# ---------- SERVER ----------
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server . .

# ---------- CLIENT ----------
WORKDIR /app/client
# Copy only package files first (for caching)
COPY client/package*.json ./
RUN npm install
# Copy all client source files
COPY client ./
# Build frontend
RUN npm run build

# ---------- FINAL SETUP ----------
WORKDIR /app
EXPOSE 8080
CMD ["node", "server/app.js"]

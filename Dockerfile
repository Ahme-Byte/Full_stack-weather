FROM node:18

# App root
WORKDIR /app

# ---------- SERVER ----------
COPY server ./server
WORKDIR /app/server
RUN npm install

# ---------- CLIENT ----------
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build   # Build React app to generate 'dist' folder

# Expose Railway port (use the environment variable PORT)
EXPOSE 8080

# ---------- START BACKEND ----------
WORKDIR /app
CMD ["node", "server/app.js"]

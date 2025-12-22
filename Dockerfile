FROM node:18

# App root
WORKDIR /app

# ---------- SERVER ----------
COPY server ./server
WORKDIR /app/server
RUN npm install

# ---------- CLIENT ----------
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install
# RUN npm run build   # uncomment if you want to rebuild frontend

# Expose Railway port
EXPOSE 3000

# Start backend server
WORKDIR /app
CMD ["node", "server/app.js"]

# ---------- Use Node 20 ----------
FROM node:20

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

# ---------- FRONTEND BUILD ----------
ARG VITE_WEATHER_API_KEY
ARG VITE_BACKEND_DOMAIN
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY
ENV VITE_BACKEND_DOMAIN=$VITE_BACKEND_DOMAIN

# ---------- BACKEND ENV (THIS WAS MISSING) ----------
ARG MONGODB_USER
ARG MONGODB_PASS
ENV MONGODB_USER=$MONGODB_USER
ENV MONGODB_PASS=$MONGODB_PASS

RUN npm run build

# ---------- FINAL ----------
WORKDIR /app
EXPOSE 8080
CMD ["node", "server/app.js"]

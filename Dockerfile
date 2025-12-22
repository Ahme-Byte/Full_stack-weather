# Use Node.js
FROM node:18

# Create app directory
WORKDIR /app

# Copy backend files
COPY backend ./backend

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy frontend files
WORKDIR /app
COPY frontend ./frontend

# Install frontend dependencies (build already exists)
WORKDIR /app/frontend
RUN npm install

# Expose port (Railway uses PORT env automatically)
EXPOSE 3000

# Start backend server
WORKDIR /app
CMD ["node", "backend/app.js"]

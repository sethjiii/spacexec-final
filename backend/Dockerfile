# ---- Backend Dockerfile ----
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port (5000 default)
EXPOSE 5000

# Start server
CMD ["npm", "start"]
# ---- End of Backend Dockerfile ----
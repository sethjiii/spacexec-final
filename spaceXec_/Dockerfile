# ---- Frontend Dockerfile ----
FROM node:18-alpine AS build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps


# Copy source
COPY . .

# Build Vite app
RUN npm run build

# ---- Serve with Nginx ----
FROM nginx:alpine

# Copy build files to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional, to handle routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# ---- End of Frontend Dockerfile ----
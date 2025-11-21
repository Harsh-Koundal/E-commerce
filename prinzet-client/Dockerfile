FROM node:18 AS builder

WORKDIR /app

ARG VITE_REACT_APP_BACKEND_BASEURL
ARG VITE_REACT_APP_GOOGLE_CLIENT_ID

ENV VITE_REACT_APP_BACKEND_BASEURL=$VITE_REACT_APP_BACKEND_BASEURL
ENV VITE_REACT_APP_GOOGLE_CLIENT_ID=$VITE_REACT_APP_GOOGLE_CLIENT_ID
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files
COPY package.json package-lock.json ./

# Clean install to avoid npm cache issues
RUN rm -rf node_modules
RUN npm install --include=optional

# Copy source code
COPY . .

RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 82

CMD ["nginx", "-g", "daemon off;"]
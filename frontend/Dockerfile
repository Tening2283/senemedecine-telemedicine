# Dockerfile pour le frontend React
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY yarn.lock* ./

# Installer les dépendances
RUN npm ci --silent

# Copier le code source
COPY . .

# Arguments de build
ARG REACT_APP_API_URL=http://localhost:3001/api/v1
ARG REACT_APP_ORTHANC_URL=http://localhost:8042

# Variables d'environnement pour le build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ORTHANC_URL=$REACT_APP_ORTHANC_URL
ENV GENERATE_SOURCEMAP=false

# Construire l'application
RUN npm run build

# Stage de production avec Nginx
FROM nginx:alpine AS production

# Installer curl pour les health checks
RUN apk add --no-cache curl

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers construits depuis le stage builder
COPY --from=builder /app/build /usr/share/nginx/html

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nginx-group
RUN adduser -S nginx-user -u 1001 -G nginx-group

# Ajuster les permissions
RUN chown -R nginx-user:nginx-group /usr/share/nginx/html
RUN chown -R nginx-user:nginx-group /var/cache/nginx
RUN chown -R nginx-user:nginx-group /var/log/nginx
RUN chown -R nginx-user:nginx-group /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R nginx-user:nginx-group /var/run/nginx.pid

# Changer vers l'utilisateur non-root
USER nginx-user

# Exposer le port
EXPOSE 80

# Commande de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]


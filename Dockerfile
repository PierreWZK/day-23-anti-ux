# Image de production pour Coolify : site statique servi par nginx (port 80).
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80

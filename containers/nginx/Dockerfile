FROM nginx:trixie
COPY nginx.conf /etc/nginx/nginx.conf 
RUN mkdir -p data/images 
RUN mkdir -p data/www
COPY data/www/index.html data/www/
COPY data/images/* data/images/
EXPOSE 54321 
CMD ["nginx-debug", "-g", "daemon off;"]

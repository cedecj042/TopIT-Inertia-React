FROM sail-8.3/app

USER root

# Install supervisor
RUN apt-get update && apt-get install -y supervisor \
    nginx \
    && mkdir -p /var/log/supervisor

COPY docker/nginx.conf /etc/nginx/nginx.conf 

# Copy supervisor config
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache \
    && mkdir -p /var/run/php-fpm \
    && chown -R www-data:www-data /var/run/php-fpm
    
EXPOSE 80

CMD ["/usr/bin/supervisord"]

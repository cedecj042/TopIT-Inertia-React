FROM sail-8.3/app

USER root

# Install supervisor
RUN apt-get update && apt-get install -y supervisor \
    && mkdir -p /var/log/supervisor

# Copy supervisor config
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Ensure correct permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord"]

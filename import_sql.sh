#!/bin/bash

for file in sql_backups/*.sql; do
    echo "Importing $file..."
    ./vendor/bin/sail mysql -u sail -psecret < "$file"
done

echo "All SQL files have been imported!"


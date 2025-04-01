#!/bin/bash
# Shebang is a special syntax that tells the os which interpreter to use when executing the script i.e., bash

# Command instructs shell to immediately exit script if any errors occur
set -e

# End of SQL (EOSQL) - A delimiter used in a here document
# <<- Allows for indentation in a here document

echo "Waiting for PostgreSL to be available..."
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
    sleep 1
done

echo "Enabling PostGIS..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enables PostGis
    CREATE EXTENSION postgis;
EOSQL
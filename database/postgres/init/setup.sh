#!/bin/bash
# Shebang is a special syntax that tells the os which interpreter to use when executing the script i.e., bash

# Command instructs shell to immediately exit script if any errors occur
set -e

# End of SQL (EOSQL) - A delimiter used in a here document
# <<- Allows for indentation in a here document

apt-get update

apt-get install postgresql-16-postgis-3

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    # Enable the PostGIS extension
    CREATE EXTENSION postgis;

    CREATE USER $POSTGRES_ACCESS_USER WITH PASSWORD '$POSTGRES_ACCESS_PASSWORD';
    ALTER DATABASE $POSTGRES_DB OWNER TO $POSTGRES_ACCESS_USER;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $POSTGRES_ACCESS_USER;
EOSQL
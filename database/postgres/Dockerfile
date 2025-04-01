# Rather than using the official PostgreSQL image, use POSTGIS which supports geospacial data
FROM postgis/postgis:latest

# Copy initialization SQL scripts into the container
COPY init /docker-entrypoint-initdb.d/

# Ensure scripts are executable
RUN chmod -R /docker-entrypoint-initdb.d/

# Expose Postgres default port
EXPOSE 5432

# Use the default PostgreSQL entrypoint
CMD ["postgres"]
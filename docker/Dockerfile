# Use the official CouchDB image
FROM couchdb 

# Add custom configuration files
COPY local.ini /opt/couchdb/etc/local.d/local.ini

# Run CouchDB
CMD ["couchdb"]

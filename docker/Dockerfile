# STEP 1
# ======
FROM couchdb

# Define the base directory for our app
WORKDIR /scan

# Install jq inside the container, needed to parse JSON responses
RUN apt-get update && apt-get install -y jq

# Copy configuration files
COPY .env .
COPY init ./init
COPY local.ini /opt/couchdb/etc/local.d/

# For example, CMD to start CouchDB
CMD ["couchdb"]

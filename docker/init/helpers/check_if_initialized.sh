#!/bin/bash

# Check if CouchDB is initialized
check_if_initialized() {
    attempts=0

    log_title "INITIALISATION START"

    while [ $attempts -lt $COUCHDB_ATTEMPT_MAX ]; do
        sleep $COUCHDB_ATTEMPT_DELAY

        if curl -X GET $AUTHENTICATED_COUCHDB_URL \
            -s \
            >/dev/null; then

            log "Done !" "success"

            return 0
        else
            attempts=$((attempts + 1))
            log_step "Attempt $attempts...$([ $attempts -gt 1 ] && log_warning " Waiting...")"

            sleep $COUCHDB_ATTEMPT_DELAY
        fi
    done

    log_error "Maximum attempts reached"

    return 1

}

#!/bin/bash

. "$(dirname "$0")/helpers/check_if_initialized.sh"
. "$(dirname "$0")/helpers/loggers.sh"
. "$(dirname "$0")/helpers/create_databases.sh"
. "$(dirname "$0")/helpers/delete_all_databases.sh"
. "$(dirname "$0")/seed/seed_databases.sh"

readonly AUTHENTICATED_COUCHDB_URL=http://$COUCHDB_USER:$COUCHDB_PASSWORD@$COUCHDB_HOST:$COUCHDB_PORT

if check_if_initialized; then
    if [ "$ENVIRONMENT" = "development" ]; then
        delete_all_databases
    fi

    create_databases "_users" "_replicator" "_global_changes" "events" "persons"

    if [ "$ENVIRONMENT" = "development" ]; then
        seed_databases
    fi

    log_title "INITIALIZATION END !"
else
    log_title "INITIALIZATION FAILED. EXITING..."
fi

# TODO : LIST DOCUMENT / DETAIL DOCUMENT
# TODO : RESTRICT DATABASE
# FRONT END : REMOVE ALL THAT IS NOT IN BACKEND UPDATE DB

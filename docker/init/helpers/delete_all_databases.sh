#!/bin/bash

# Delete all databases
delete_all_databases() {
    log_title "RESETING DATABASE BEFORE SEEDING..."

    response=$(
        curl -X GET $AUTHENTICATED_COUCHDB_URL/_all_dbs \
            -w '\n%{http_code}' \
            -s
    )

    local response_status=$(echo "$response" | tail -n 1)
    local response_data=$(echo "$response" | head -n -1)

    if [ "$response_status" -eq 200 ]; then
        if [ "$response_data" = "[]" ]; then
            log_step "No databases found."
        else
            for database in $(echo "$response_data" | jq -r '.[]'); do
                delete_database $database
            done
        fi
    else
        log_error "Error"
    fi
}

# Delete a single database
delete_database() {
    log_separator
    echo "Deleting database '$1'..."

    local response_status=$(
        curl -X DELETE "$AUTHENTICATED_COUCHDB_URL/$1" \
            -w '%{http_code}' \
            -s \
            -o /dev/null
    )

    if [ "$response_status" -eq 200 ]; then
        log_success "Done !"
    else
        log_error "Error."
    fi

    log_separator
}

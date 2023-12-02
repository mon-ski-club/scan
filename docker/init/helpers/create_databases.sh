#!/bin/bash

# Check and create all single database
create_databases() {
    log_title "CREATE DATABASES"

    for database in "$@"; do
        create_database $database
    done
}

# Check and create a single database
create_database() {
    log_separator
    echo "Checking existence of database '$database'..."

    local check_response_status=$(
        curl -X GET $AUTHENTICATED_COUCHDB_URL/$database \
            -w '%{http_code}' \
            -o /dev/null \
            -s
    )

    if [ "$check_response_status" -eq 200 ]; then
        echo "Database '$database' already exists." && log_warning "Skiping..."
    else
        echo "Database '$database' does not exist." && log_warning Creating...

        local create_response_status=$(
            curl -X PUT $AUTHENTICATED_COUCHDB_URL/$database \
                -w '%{http_code}' \
                -o /dev/null \
                -s
        )

        if [ "$create_response_status" -eq 200 ] || [ "$create_response_status" -eq 201 ]; then
            log_success "Done !"
        else
            log_error "Error."
        fi
    fi

    log_separator
}

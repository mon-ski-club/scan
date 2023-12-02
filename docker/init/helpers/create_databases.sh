#!/bin/bash

# Check and create all single database
create_databases() {
    log_title "CREATE DATABASES"

    databases=$(jq -c '.' "$(dirname "$0")/seed/_databases.json")

    for database in $(echo "$databases" | jq -c '.[]'); do
        create_database $database
    done
}

# Check and create a single database
create_database() {
    log_separator

    database_name=$(echo "$database" | jq -r '.name')
    database_security=$(echo "$database" | jq -c '.security')

    echo "Checking existence of database '$database_name'..."

    local check_response_status=$(
        curl -X GET $AUTHENTICATED_COUCHDB_URL/$database_name \
            -w '%{http_code}' \
            -o /dev/null \
            -s
    )

    if [ "$check_response_status" -eq 200 ]; then
        echo "Database '$database_name' already exists." && log_warning "Skiping..."
    else
        echo "Database '$database_name' does not exist." && log_warning Creating...

        local create_response_status=$(
            curl -X PUT $AUTHENTICATED_COUCHDB_URL/$database_name \
                -w '%{http_code}' \
                -o /dev/null \
                -s
        )

        if [ "$database_security" != "null" ]; then
            echo "Database '$database_name' has security requirements." && log_warning "Processing..."
            local setting_security_response_status=$(
                curl -X PUT $AUTHENTICATED_COUCHDB_URL/$database_name/_security \
                    -H 'content-type: application/json' \
                    -H 'accept: application/json' \
                    -w '%{http_code}' \
                    -o /dev/null \
                    -d $database_security \
                    -s
            )

            if [ "$setting_security_response_status" -ne 200 ]; then
                log_error "Error (Security)."
            fi
        fi

        if [ "$create_response_status" -eq 200 ] || [ "$create_response_status" -eq 201 ]; then
            log_success "Done !"
        else
            log_error "Error (Creation)."
        fi
    fi

    log_separator
}

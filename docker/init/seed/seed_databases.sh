#!/bin/bash

seed_databases() {
    log_title "SEEDING..."

    seed_users

    seed_all_documents
}

seed_users() {
    _users=$(jq -c '.' "$(dirname "$0")/seed/_users.json")

    for _user in $(echo "${_users}" | jq -c '.[]'); do
        log_separator
        user_name=$(echo $_user | jq -r '.name')
        echo "Inserting $user_name in _users database..."

        local create_user_response=$(curl \
            -X PUT "$AUTHENTICATED_COUCHDB_URL/_users/org.couchdb.user:$(echo "$user_name" | tr '[:upper:]' '[:lower:]')" \
            -w '%{http_code}' \
            -H "Accept: application/json" \
            -s \
            -o /dev/null \
            -H "Content-Type: application/json" \
            -d "$_user")

        if [ "$create_user_response" -eq 201 ]; then
            log_success "Done !"

        elif [ "$create_user_response" -eq 409 ]; then
            log "User $user_name already exists."
            log_warning "Skiping..."
        fi

        log_separator
    done
}
seed_all_documents() {
    _docs=$(jq -c '.' "$(dirname "$0")/seed/_docs.json")

    for key in $(echo "${_docs}" | jq -r 'keys[]'); do
        seed_document "${_docs}" "${key}"
        log_separator
    done
}

seed_document() {
    local _docs="$1"
    local key="$2"

    # Use jq to iterate over array elements and process each one
    echo "${_docs}" | jq -c ".$key[]" | while IFS= read -r obj; do
        log_separator
        doc_name=$(echo "$obj" | jq -e -r '.name // .firstName')

        if [ -n "$doc_name" ]; then
            echo "Inserting "$doc_name" in "$key" database..."

            local insert_doc_response=$(curl \
                -X POST "$AUTHENTICATED_COUCHDB_URL/$key" \
                -H "Content-Type: application/json" \
                -w '%{http_code}' \
                -s \
                -o /dev/null \
                -d "$obj")

            if [ "$insert_doc_response" -eq 201 ]; then
                log_success "Done !"
            elif [ "$insert_doc_response" -eq 409 ]; then
                log "Document "$doc_name" already exists."
                log_warning "Skipping..."
            else
                log_error "Error."
            fi
        else
            log_error "Invalid JSON object: $obj"
        fi
    done
}

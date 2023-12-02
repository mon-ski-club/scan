#!/bin/bash

ERROR='\033[1;31m'   # Bold red for errors
SUCCESS='\033[1;32m' # Bold green for success
WARNING='\033[1;33m' # Bold yellow for warning
RESET='\033[0m'      # Reset color

# ERROR='\033[41;1;37m'   # Red background for errors
# SUCCESS='\033[42;1;37m' # Green background for success
# WARNING='\033[43;1;30m' # Yellow background for warning
# RESET='\033[0m'         # Reset color

###########
## TITLE ##
###########
log_title() {
    local string="$1"
    local length=$((${#string} + 6))

    printf "%${length}s\n" | tr ' ' '#'
    echo "## $string ##"
    printf "%${length}s\n" | tr ' ' '#'
}

# ----
# Step
# ----
log_step() {
    log_separator
    echo $1
    log_separator
}

# ------------------------
log_separator() {
    echo "------------------------"
}

# Error colored echo
log_error() {
    echo "${ERROR}$1${RESET}"
}

# Success colored echo
log_success() {
    echo "${SUCCESS}$1${RESET}"
}

# Warning colored echo
log_warning() {
    echo "${WARNING}$1${RESET}"
}

log() {
    if test "$2" = "error"; then
        log_error "$1"
    elif test "$2" = "success"; then
        log_success "$1"
    elif test "$2" = "warning"; then
        log_success "$1"
    else
        echo $1
    fi
}

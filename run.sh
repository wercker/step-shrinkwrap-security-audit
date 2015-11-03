#!/bin/sh

# Check if command exists exists in the current path
# $1: Name of the command to check
# return 0 if it does exist, return 1 if it does not exits
command_exists() {
    local command_name=$1;

    command -v "$command_name" > /dev/null 2>&1
}

# Check if a file exists and if it is a file.
# $1: Path to the file to check
# return 0 if it does exist, return 1 if it does not exist
is_file() {
    local path=$1

    [ -f "$path" ]
}

# Execute nodejs script to do the actual security audit
# $1: Path to step root directory.
# $2: Path to shrinkwrap file.
security_audit() {
    local step_path=$1
    local shrinkwrap_path=$2

    node "$step_path/bin/security_audit.js" "$shrinkwrap_path"
}

# Get the path to the shrinkwrap file. First checks the wercker parameter,
# otherwise uses the default "./npm-shrinkwrap.json"
# returns the path by echo
get_shrinkwrap_path() {
    if [ -n "$WERCKER_SHRINKWRAP_SECURITY_AUDIT_SHRINKWRAP_PATH" ]; then
        echo "$WERCKER_SHRINKWRAP_SECURITY_AUDIT_SHRINKWRAP_PATH"
    else
        echo "./npm-shrinkwrap.json"
    fi
}

# Get the path to the wercker step root. First checks if running in a wercker environment,
# otherwise uses the $PWD
# returns the path by echo
get_step_path() {
    if [ -n "$WERCKER_STEP_ROOT" ]; then
        echo "$WERCKER_STEP_ROOT"
    else
        echo "$PWD"
    fi
}

get_ignores() {
    if [ -n "$WERCKER_SHRINKWRAP_SECURITY_AUDIT_SHRINKWRAP_IGNORE" ]; then
        echo "$WERCKER_SHRINKWRAP_SECURITY_AUDIT_SHRINKWRAP_IGNORE";
    else
        echo ""
    fi
}

main() {
    set -e
    if ! command_exists "node"; then
        fail "node not found, make sure it exists in the \$PATH"
    fi

    local step_path
    local shrinkwrap_path
    local ignores

    step_path=$(get_step_path)
    shrinkwrap_path=$(get_shrinkwrap_path)
    ignores=$(get_ignores)

    if is_file "$shrinkwrap_path"; then
        security_audit "$step_path" "$shrinkwrap_path" "$ignores"
    else
        fail "Shrinkwrap file was not found"
    fi
}

main

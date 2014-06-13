
check_for_node() {
    command -v node > /dev/null 2>&1 || \
        { echo >&2 "node executable is not found. Make sure it is available in \$PATH"; exit 23; }
}

check_shrinkwrap_path() {
    local shrinkwrap_path=$1;

    if [ ! -f "$shrinkwrap_path" ]; then
        echo >&2 "shrinkwrap file not found";
        return 1;
    fi;

    return 0;
}

security_audit() {
    local shrinkwrap_path=$1;
    
    node "./bin/security_audit" "$shrinkwrap_path" 
}

main() {
    check_for_node;

    local step_path=${WERCKER_STEP_ROOT:-$PWD};
    local shrinkwrap_path='./npm-shrinkwrap.json';

    if [ -n "$WERCKER_SHRINKWRAP_SECURITY_AUDIT_SHRINKWRAP_PATH" ]; then
        shrinkwrap_path="$WERCKER_SHRINKWRAP_SECURITY_AUDIT_SHRINKWRAP_PATH";
    fi

    if check_shrinkwrap_path "$shrinkwrap_path"; then 
        security_audit "$shrinkwrap_path";
    fi;
}

main;
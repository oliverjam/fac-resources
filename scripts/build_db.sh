#! /bin/bash

# exit immediately on error
set -e

GREEN="\033[0;92m"
RESET="\033[0m"

psql -q fac_resources -f "src/database/init.sql"
echo "${GREEN}Database built${RESET}"

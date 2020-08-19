#! /bin/bash

# exit immediately on error
set -e

GREEN="\033[0;92m"
RESET="\033[0m"

psql -q -c "CREATE USER fac_resources_user SUPERUSER PASSWORD 'local123'"
echo "${GREEN}Postgres user 'fac_resources_user' created${RESET}"

psql -q -c "CREATE DATABASE fac_resources WITH OWNER fac_resources_user"
echo "${GREEN}Postgres database 'fac_resources' created${RESET}"

cp -n .env.example .env
echo "${GREEN}'.env' file created${RESET}"

sh ./scripts/build_db.sh
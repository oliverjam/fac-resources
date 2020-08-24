#! /bin/bash

# exit immediately on error
set -e

GREEN="\033[0;92m"
RESET="\033[0m"

GIT_V=$(git --version)
echo "${GREEN}${GIT_V} is installed${RESET}"

NODE_V=$(node --version)
echo "${GREEN}node ${NODE_V} is installed${RESET}"

NPM_V=$(npm --version)
echo "${GREEN}npm ${NPM_V} is installed${RESET}"

PG_V=$(psql --version)
echo "${GREEN}${PG_V} is installed${RESET}"
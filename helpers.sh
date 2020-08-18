#!/usr/bin/env bash
set -xeuo pipefail

build() {
  npm install
  npm run build:production
}

deploy() {
  func azure functionapp publish ${APP_NAME}
}

get-appid() {
  PRINCIPAL_ID=$1
  az ad sp list --filter "objectId eq '${PRINCIPAL_ID}'"
}

# Call the requested function and pass the arguments as-is
"$@"

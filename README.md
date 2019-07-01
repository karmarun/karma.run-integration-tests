Karma.run Integration Tests
===========================

## REQUIREMENTS
* Docker (CE) app is running
* installed [gcloud](https://cloud.google.com/sdk/install)
* configured [gcloud as a docker credential helper](https://cloud.google.com/container-registry/docs/advanced-authentication#gcloud_as_a_docker_credential_helper)

## SETUP DEVELOPMENT ENVIRONMENT
* `make setup-env` create .env file, npm install
* `make dev` start docker-compose

## Watch
* `make watch` create .env file, npm install

## Test once
* `make test` create .env file, npm install

## sh
* `make sh` get a sh and run some commands like:

#### Test specific file
`yarn ava dist/sdk/expressions/<file>.js --serial`
eg. `yarn ava dist/queries/expressions/crud.js --serial`

#### Test specific test in file
`yarn ava dist/queries/expressions/<file>.js --serial -m <test>`
eg. `yarn ava dist/queries/expressions/crud.js --serial -m all`
Karma.run Integration Tests
===========================

## REQUIREMENTS
* Docker (CE) app is running

## SETUP DEVELOPMENT ENVIRONMENT
* `make setup-env` create .env file, npm install
* `make dev` start docker-compose

## Watch
* `make watch` test continuously

## Test once
* `make test` test once

## sh
* `make sh` get a sh and run some commands like:

#### Test specific file
`yarn ava dist/sdk/expressions/<file>.js --serial`
eg. `yarn ava dist/queries/expressions/crud.js --serial`

#### Test specific test in file
`yarn ava dist/queries/expressions/<file>.js --serial -m <test>`
eg. `yarn ava dist/queries/expressions/crud.js --serial -m all`
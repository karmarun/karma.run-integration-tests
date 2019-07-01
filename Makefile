pwd = $(shell pwd)
image = node:12
container = nodejs
docker-run-nodejs = docker run -ti --rm --network=karmarun-integration-tests_default -v=$(pwd):/usr/src/service:delegated -w=/usr/src/service --env-file=./.env $(image)

setup-env:
		node ./scripts/setup-env.js
		make install

install:
		$(docker-run-nodejs) yarn install

dev:
		docker-compose up

dev-down:
		docker-compose down

sh:
		docker exec -ti $(container) sh

test:
		docker exec -ti $(container) yarn test

watch:
		docker exec -ti $(container) yarn watch

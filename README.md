Karma.run Integration Tests
===========================

Prerequisites
-------------
- Node.js >= v9.11.0
- Yarn >= v1.6.0

Get Started
-----------
```
cp .env.example .env
```
// Fill in required env variables in .env file
```
yarn install
yarn watch
```

Test specific file
-----------
```
yarn watch:build
ava dist/queries/expressions/<file>.js
```

Test specific test in file
-----------
```
yarn watch:build
ava dist/queries/expressions/<file>.js -m <test>
```
# INSTALL AVA
```
npm install ava --global 
npm install tap-nyan --global
ava --init
```

# SETUP ENVIRONMENT
* `npm install`
* create .env with the fields:
```
KARMA_ENDPOINT=https://api.karma.run
KARMA_INSTANCE_SECRET=
```

# RUN TESTS
`npm test`

or ava file eg:
`ava test/general.js -v`


# .ENV File
* KARMA_ENDPOINT=http://localhost:8005
* KARMA_INSTANCE_SECRET=YOUR_VERY_LONG_SECRET
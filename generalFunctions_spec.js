require('dotenv').config();
const frisby = require('frisby');

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const dbName = 'db-api-test-functions'
const dbNameBody = '"' + dbName + '"'

deleteDb();

function deleteDb () {
  frisby.create('delete db')
    .post(KARMA_ENDPOINT + '/root/delete_db', null,
      {
        json: false,
        body: dbNameBody
      }
    )
    .addHeader('X-Karma-Secret', KARMA_INSTANCE_SECRET)
    .addHeader('X-Karma-Codec', 'json')
    .after(function (err, res, body) {
      console.log("****************************************************************************************************")
      console.log("/root/delete_db")
      console.log(body)
      createDb()
    })
    .toss();
}

function createDb () {
  frisby.create('create db')
    .post(KARMA_ENDPOINT + '/root/create_db', null,
      {
        json: false,
        body: dbNameBody
      }
    )
    .addHeader('X-Karma-Secret', KARMA_INSTANCE_SECRET)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .after(function (err, res, body) {
      console.log("****************************************************************************************************")
      console.log("/root/create_db")
      console.log(body)
      loginWithInstanceSecret();
    })
    .toss();
}

function loginWithInstanceSecret () {
  frisby.create('login with instance secret')
    .post(KARMA_ENDPOINT + '/auth', null,
      {
        json: false,
        body: JSON.stringify({
          "username": "admin",
          "password": KARMA_INSTANCE_SECRET
        })
      }
    )
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toMatch(/^[\S]{40,}$/);
      execQueries(json);
    })
    .toss();
}


function execQueries (signature) {
  frisby.create('function add')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "add": [2, 4]
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe(6);
    })
    .toss();

  frisby.create('function subtract')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "subtract": [2, 4]
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe(-2);
    })
    .toss();

  frisby.create('function multiply')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "multiply": [2.2, {"newFloat": 4}]
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe(8.8);
    })
    .toss();

  frisby.create('function divide')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "divide": [{"newFloat": 2}, {"newFloat": -4}]
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .inspectBody()
    .afterJSON(function (json) {
      expect(json).toBe(-0.5);
    })
    .toss();

}
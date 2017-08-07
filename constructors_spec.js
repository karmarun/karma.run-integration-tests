require('dotenv').config();
const frisby = require('frisby');

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const dbName = 'db-api-test-constructors'
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
  frisby.create('function tag')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "tag": "_tag"
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toMatch(/^[a-zA-Z]{10,40}$/);
    })
    .toss();

  frisby.create('function newBool')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newBool": true
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe(true);
    })
    .toss();

  frisby.create('function newInt')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newInt": Number.MIN_SAFE_INTEGER
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe(Number.MIN_SAFE_INTEGER);
    })
    .toss();

  frisby.create('function newFloat')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newFloat": -0.00099999
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe(-0.00099999);
    })
    .toss();

  frisby.create('function newDateTime')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newDateTime": "2017-01-01T00:00:00Z"
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe("2017-01-01T00:00:00Z");
    })
    .toss();

  frisby.create('function newString')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newString": "àèöäü😀🐱"
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe("àèöäü😀🐱");
    })
    .toss();

  frisby.create('function newList')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newList": [
            1, 2, 3
          ]
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .expectJSON([
      1, 2, 3
    ])
    .toss();

  frisby.create('function newTuple')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newTuple": ["foo", 123]
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .expectJSON(["foo", 123])
    .toss();

  frisby.create('function newMap')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newMap": {"foo": 1, "bar": 4}
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .expectJSON({
      "foo": 1, "bar": 4
    })
    .toss();

  frisby.create('function newStruct')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newStruct": {
            "myInt": Number.MAX_SAFE_INTEGER,
            "myFloat": -0.00099999,
          }
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .expectJSON({
      "myInt": Number.MAX_SAFE_INTEGER,
      "myFloat": -0.00099999
    })
    .toss();

  frisby.create('function newUnion')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "newUnion": {"foo": 4}
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .expectJSON({"foo": 4})
    .toss();

}
require('dotenv').config();
const frisby = require('frisby');


const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const dbName = 'db-api-test-crud'
const dbNameBody = '"' + dbName + '"'

let signature = null;

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
      signature = json
      all();
      first();
      refTo();
      createModel();
    })
    .toss();
}

function createModel () {
  frisby.create('function create model')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "create": {
              "in": {
                "tag": "_model"
              },
              "value": {
                "contextual": {
                  "struct": {
                    "foo": {
                      "string": {}
                    },
                    "bar": {
                      "int": {}
                    }
                  }
                }
              }
            }
          }
        )
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toMatch(/^[\S]{10,}$/);
      createEntry(json)
    })
    .inspectBody()
    .toss();
}

function createEntry (modelId) {
  frisby.create('function create entry')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "create": {
              "in": {
                "model": modelId
              },
              "value": {
                "contextual": {
                  "foo": "data",
                  "bar": 333
                }
              }
            }
          }
        )
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toMatch(/^[\S]{10,}$/);
      update(modelId, json)
    })
    .toss();
}

function update (modelId, objectId) {
  frisby.create('function update')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "update": {
              "ref": {
                "newRef": {
                  "model": {
                    "model": modelId
                  },
                  "id": objectId
                }
              },
              "value": {
                "contextual": {
                  "foo": "dada",
                  "bar": 333
                }
              }
            }
          }
        )
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .inspectBody()
    .afterJSON(function (json) {
      // expect(json).toMatch(/^[\S]{10,}$/);
      functionGet(modelId, objectId)
    })
    .toss();
}

function functionDelete (modelId, objectId) {
  frisby.create('function update')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "delete": {
              "newRef": {
                "model": {
                  "model": modelId
                },
                "id": objectId
              }
            }
          }
        )
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {

    })
    .toss();
}

function functionGet (modelId, objectId) {
  frisby.create('function update')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "get": {
              "newRef": {
                "model": {
                  "model": modelId
                },
                "id": objectId
              }
            }
          }
        )
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .expectJSON({"bar": 333, "foo": "dada"})
    .afterJSON(function (json) {
      functionDelete(modelId, objectId)
    })
    .toss();
}

function tag () {
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
}

function all () {
  frisby.create('function all')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "all": {
            "tag": "_tag"
          }
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .inspectJSON()
    .expectJSONTypes('?', {
      model: String,
      tag: String
    })
    .toss();
}

function first () {
  frisby.create('function first')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "first": {
            "all": {
              "tag": "_tag"
            }
          }
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .inspectJSON()
    .expectJSONTypes({
      model: String,
      tag: String
    })
    .toss();
}

function refTo () {
  frisby.create('function refTo')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "refTo": {
            "first": {
              "all": {
                "tag": "_tag"
              }
            }
          }
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .inspectJSON()
    .toss();
}





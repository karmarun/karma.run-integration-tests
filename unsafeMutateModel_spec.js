require('dotenv').config();
const frisby = require('frisby');


const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const dbName = 'db-api-test-unsafe-mutate-model'
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
      createTestModel(signature);
    })
    .toss();
}


function createTestModel (signature) {
  frisby.create('function create model')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "do": {
              "createModels": {
                "createMultiple": {
                  "in": {
                    "tag": "_model"
                  },
                  "values": {
                    "testModel": {
                      "contextual": {
                        "struct": {
                          "myString": {
                            "string": {}
                          },
                          "myInt": {
                            "int": {}
                          },
                          "myFloat": {
                            "float": {}
                          }
                        }
                      }
                    }
                  }
                }
              },
              "createTag": {
                "create": {
                  "in": {
                    "tag": "_tag"
                  },
                  "value": {
                    "newStruct": {
                      "tag": {
                        "field": {
                          "name": "key",
                          "value": {
                            "id": {}
                          }
                        }
                      },
                      "model": {
                        "field": {
                          "name": "value",
                          "value": {
                            "id": {}
                          }
                        }
                      }
                    }
                  }
                }
              },
              "return": {
                "mapMap": {
                  "value": {
                    "bind": "createModels"
                  },
                  "expression": {
                    "bind": "createTag"
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
      createEntries(signature)
    })
    .toss();
}


function createEntries (signature) {
  frisby.create('function create entries')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "createMultiple": {
              "in": {
                "tag": "testModel"
              },
              "values": {
                "a": {
                  "contextual": {
                    "myString": "foo",
                    "myInt": 555,
                    "myFloat": 5.55
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
      makeMigration(signature)
    })
    .toss();
}


function makeMigration (signature) {
  frisby.create('function unsafeMutateModel')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "unsafeMutateModel": {
              "model": {
                "tag": "testModel"
              },
              "expression": {
                "newStruct": {
                  "myString": {
                    "field": "myString"
                  },
                  "myInt": {
                    "field": "myInt"
                  },
                  "myFloat": {
                    "field": "myFloat"
                  },
                  "myBool": {
                    "newBool": true
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
      getAll(signature)
    })
    .inspectBody()
    .toss();
}


function getAll (signature) {
  frisby.create('function create entries')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "all": {
              "tag": "testModel"
            }
          }
        )
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .expectJSON([{"myFloat": 5.55, "myInt": 555, "myString": "foo"}])
    .inspectBody()
    .toss();
}

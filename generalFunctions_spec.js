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
      createTestModel(json);
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
                          },
                          "myDateTime": {
                            "dateTime": {}
                          },
                          "myBool": {
                            "bool": {}
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
      execQueries(signature)
    })
    .toss();
}


function execQueries (signature) {

  frisby.create('function after')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "after": [
            {
              "newDateTime": "2018-01-01T00:00:00Z"
            },
            {
              "newDateTime": "2017-01-01T00:00:00Z"
            }
          ]
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


  frisby.create('function before')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "before": [
            {
              "newDateTime": "2017-01-01T00:00:00Z"
            },
            {
              "newDateTime": "2018-01-01T00:00:00Z"
            }
          ]
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


  frisby.create('function greater')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "greater": [
            2.2,
            2.1
          ]
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


  frisby.create('function less')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "less": [
            1,
            2
          ]
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


  frisby.create('function equal')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "equal": [
            "foo",
            "foo"
          ]
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


  frisby.create('function and')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "and": [
            {
              "equal": [
                4,
                4
              ]
            },
            true
          ]
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


  frisby.create('function or')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "or": [
            {
              "equal": [
                4,
                4
              ]
            },
            false
          ]
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


  frisby.create('function field')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "field": {
            "name": "foo",
            "value": {
              "newStruct": {
                "foo": "bar"
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
    .afterJSON(function (json) {
      expect(json).toBe("bar");
    })
    .toss();


  frisby.create('function key')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "key": {
            "name": "foo",
            "value": {
              "newMap": {"foo": "bar"}
            }
          }
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe("bar");
    })
    .toss();


  frisby.create('function not')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "not": false
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

  frisby.create('function not')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "not": false
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
    .afterJSON(function (json) {
      expect(json).toBe(-0.5);
    })
    .toss();


  frisby.create('function zero')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "get": {
            "create": {
              "in": {
                "tag": "testModel"
              },
              "value": {
                "zero": {}
              }
            }
          },
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .expectJSON({myBool: false, myDateTime: '1754-08-30T22:43:41Z', myFloat: 0, myInt: 0, myString: ''})
    .toss();


  frisby.create('function intToFloat')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "divide": [{"newFloat": 2}, {"intToFloat": {"newInt": -4}}]
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(200)
    .afterJSON(function (json) {
      expect(json).toBe(-0.5);
    })
    .toss();


  frisby.create('function floatToInt')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "add": [{"newInt": 2}, {"floatToInt": {"newFloat": -4}}]
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


  frisby.create('function assertCase')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify({
          "assertCase": {
            "case": "foo",
            "value": {
              "newUnion": {"bar": 4}
            }
          }
        })
      }
    )
    .addHeader('X-Karma-Signature', signature)
    .addHeader('X-Karma-Database', dbName)
    .addHeader('X-Karma-Codec', 'json')
    .expectStatus(400)
    .expectJSON({
        "context": {
          "actual": {
            "union": {
              "bar": {
                "int": {}
              }
            }
          },
          "error": {
            "context": {
              "path": [
                "bar"
              ]
            },
            "message": "case",
            "type": "validation"
          },
          "expected": {
            "union": {
              "foo": {
                "any": {}
              }
            }
          }
        },
        "message": "type checking failed",
        "program": {
          "newUnion": {
            "bar": 4
          }
        },
        "type": "compilation"
      }
    )
    .toss();
}
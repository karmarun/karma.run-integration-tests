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
      // refTo();
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
                    "checkbox": {
                      "bool": {}
                    },
                    "number": {
                      "int": {}
                    },
                    "decimalNumber": {
                      "float": {}
                    },
                    "text": {
                      "string": {}
                    },
                    "dateAndTime": {
                      "dateTime": {}
                    },
                    "list": {
                      "list": {
                        "struct": {
                          "fieldA": {
                            "string": {}
                          },
                          "filedB": {
                            "string": {}
                          }
                        }
                      }
                    },
                    "map": {
                      "map": {
                        "string": {}
                      }
                    },
                    "struct": {
                      "struct": {
                        "fieldA": {
                          "string": {}
                        },
                        "filedB": {
                          "string": {}
                        }
                      }
                    },
                    "union": {
                      "union": {
                        "variantA": {
                          "struct": {
                            "stringA": {
                              "string": {}
                            },
                            "intA": {
                              "int": {}
                            }
                          }
                        },
                        "variantB": {
                          "struct": {
                            "stringB": {
                              "string": {}
                            },
                            "intB": {
                              "int": {}
                            }
                          }
                        }
                      }
                    },
                    "tuple": {
                      "tuple": [
                        {
                          "int": {}
                        },
                        {
                          "string": {}
                        }
                      ]
                    },
                    "selectBox": {
                      "enum": [
                        "foo",
                        "bar",
                        "pop"
                      ]
                    },
                    "set": {
                      "set": {
                        "int": {}
                      }
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
                  "checkbox": true,
                  "dateAndTime": "2017-08-02T00:00:00Z",
                  "decimalNumber": 0.5,
                  "list": [
                    {
                      "fieldA": "a",
                      "filedB": "b"
                    }
                  ],
                  "map": {
                    "a": "a",
                    "b": "b"
                  },
                  "number": 1,
                  "struct": {
                    "fieldA": "a",
                    "filedB": "b"
                  },
                  "text": "example text",
                  "tuple": [
                    5,
                    "example tuple"
                  ],
                  "selectBox": "bar",
                  "set": [
                    1,
                    2,
                    3
                  ],
                  "union": {
                    "variantA": {
                      "intA": 1,
                      "stringA": "asdf"
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
                  "checkbox": false,
                  "dateAndTime": "2018-08-02T00:00:00Z",
                  "decimalNumber": 0.5,
                  "list": [
                    {
                      "fieldA": "a",
                      "filedB": "b"
                    }
                  ],
                  "map": {
                    "a": "a",
                    "b": "b"
                  },
                  "number": 1,
                  "struct": {
                    "fieldA": "a",
                    "filedB": "b"
                  },
                  "text": "example text changed",
                  "tuple": [
                    5,
                    "example tuple"
                  ],
                  "selectBox": "bar",
                  "set": [
                    1,
                    2,
                    3
                  ],
                  "union": {
                    "variantA": {
                      "intA": 1,
                      "stringA": "asdf"
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
    .inspectBody()
    .afterJSON(function (json) {
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
    .expectJSON({
      "checkbox": false,
      "dateAndTime": "2018-08-02T00:00:00Z",
      "decimalNumber": 0.5,
      "list": [
        {
          "fieldA": "a",
          "filedB": "b"
        }
      ],
      "map": {
        "a": "a",
        "b": "b"
      },
      "number": 1,
      "struct": {
        "fieldA": "a",
        "filedB": "b"
      },
      "text": "example text changed",
      "tuple": [
        5,
        "example tuple"
      ],
      "selectBox": "bar",
      "set": [
        1,
        2,
        3
      ],
      "union": {
        "variantA": {
          "intA": 1,
          "stringA": "asdf"
        }
      }
    })
    .afterJSON(function (json) {
      functionDelete(modelId, objectId)
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





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
                          },
                          "myUnion": {
                            "union": {
                              "caseA": {
                                "string": {}
                              }
                            }
                          },
                          "myStruct": {
                            "struct": {
                              "myKeyA": {
                                "string": {}
                              }
                            }
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
                    "myFloat": 5.55,
                    "myUnion": {
                      "caseA": "myCaseAString"
                    },
                    "myStruct": {
                      "myKeyA": "myStructKeyA"
                    }
                  }
                },
                "b": {
                  "contextual": {
                    "myString": "bar",
                    "myInt": 999,
                    "myFloat": 5.55,
                    "myUnion": {
                      "caseA": "myCaseAString"
                    },
                    "myStruct": {
                      "myKeyA": "myStructKeyA"
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
                  "myRenamedString": {
                    "field": "myString"
                  },
                  "myInt": {
                    "field": "myInt"
                  },
                  "myNewInt": {
                    "floatToInt": {
                      "field": "myFloat"
                    }
                  },
                  "myFloat": {
                    "field": "myFloat"
                  },
                  "myNewFloat": {
                    "add": [
                      {
                        "intToFloat": {
                          "field": "myInt"
                        }
                      },
                      {
                        "field": "myFloat"
                      }
                    ]
                  },
                  "myStruct": {
                    "newStruct": {
                      "myKeyA": {
                        "field": {
                          "name": "myKeyA",
                          "value": {
                            "field": "myStruct"
                          }
                        }
                      },
                      "myKeyB": {
                        "newInt": 888
                      }
                    }
                  },
                  "myUnion": {
                    "newUnion": {
                      "caseA": {
                        "assertCase": {
                          "case": "caseA",
                          "value": {
                            "field": "myUnion"
                          }
                        }
                      }
                    }
                  },
                  "myNewBool": {
                    "newBool": true
                  },
                  "myNewString": {
                    "newString": "Lorem ipsum"
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
      getModelEntries(signature)
    })
    .inspectBody()
    .toss();
}


function getModelEntries (signature) {
  frisby.create('get model entires')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "first": {
              "filter": {
                "value": {
                  "all": {
                    "tag": "testModel"
                  }
                },
                "expression": {
                  "equal": [
                    "foo",
                    {
                      "field": "myRenamedString"
                    }
                  ]
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
    .expectJSON({
        "myFloat": 5.55,
        "myInt": 555,
        "myNewBool": true,
        "myNewFloat": 560.55,
        "myNewInt": 5,
        "myNewString": "Lorem ipsum",
        "myRenamedString": "foo",
        "myStruct": {
          "myKeyA": "myStructKeyA",
          "myKeyB": 888
        },
        "myUnion": {
          "caseA": "myCaseAString"
        }
      }
    )
    .inspectBody()
    .afterJSON(function (json) {
      getTestModel(signature)
    })
    .toss();
}

function getTestModel (signature) {
  frisby.create('get model entires')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "first": {
              "filter": {
                "value": {
                  "all": {
                    "tag": "_model"
                  }
                },
                "expression": {
                  "equal": [
                    {
                      "refTo": {
                        "id": {}
                      }
                    },
                    {
                      "tag": "testModel"
                    }
                  ]
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
    .expectJSON({
        "struct": {
          "myFloat": {
            "float": {}
          },
          "myInt": {
            "int": {}
          },
          "myNewBool": {
            "bool": {}
          },
          "myNewFloat": {
            "float": {}
          },
          "myNewInt": {
            "int": {}
          },
          "myNewString": {
            "string": {}
          },
          "myRenamedString": {
            "string": {}
          },
          "myStruct": {
            "struct": {
              "myKeyA": {
                "string": {}
              },
              "myKeyB": {
                "int": {}
              }
            }
          },
          "myUnion": {
            "union": {
              "caseA": {
                "string": {}
              }
            }
          }
        }
      }
    )
    .inspectBody()
    .toss();
}

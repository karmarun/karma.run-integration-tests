require('dotenv').config();
const frisby = require('frisby');


const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const dbName = 'db-api-test-continuous-migrations'
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
                          "myOptional": {
                            "optional": {
                              "string": {}
                            }
                          },
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
                          },
                          "myRef": {
                            "ref": "refTestModel"
                          }
                        }
                      }
                    },
                    "refTestModel": {
                      "contextual": {
                        "struct": {
                          "myString": {
                            "string": {}
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
                  "newStruct": {
                    "myOptional": "optional string",
                    "myString": {
                      "newString": "foo"
                    },
                    "myInt": {
                      "newInt": 555
                    },
                    "myFloat": {
                      "newFloat": 5.55
                    },
                    "myUnion": {
                      "newUnion": {
                        "caseA": "myCaseAString"
                      }
                    },
                    "myStruct": {
                      "newStruct": {
                        "myKeyA": {
                          "newString": "myStructKeyA"
                        }
                      }
                    },
                    "myRef": {
                      "create": {
                        "in": {
                          "tag": "refTestModel"
                        },
                        "value": {
                          "newStruct": {
                            "myString": {
                              "newString": "test reference"
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "b": {
                  "newStruct": {
                    "myString": {
                      "newString": "bar"
                    },
                    "myInt": {
                      "newInt": 555
                    },
                    "myFloat": {
                      "newFloat": 5.55
                    },
                    "myUnion": {
                      "newUnion": {
                        "caseA": "myCaseAString"
                      }
                    },
                    "myStruct": {
                      "newStruct": {
                        "myKeyA": {
                          "newString": "myStructKeyA"
                        }
                      }
                    },
                    "myRef": {
                      "create": {
                        "in": {
                          "tag": "refTestModel"
                        },
                        "value": {
                          "newStruct": {
                            "myString": {
                              "newString": "test reference"
                            }
                          }
                        }
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
                  "myRef": {
                    "field": "myRef"
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
      getTestModelRecords(signature)
    })
    .inspectBody()
    .toss();
}


function getTestModelRecords (signature) {
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
                      "field": "myString"
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
    .expectJSON(
      {
        "myFloat": 5.55,
        "myInt": 555,
        "myNewBool": true,
        "myNewFloat": 560.55,
        "myNewInt": 5,
        "myNewString": "Lorem ipsum",
        "myRenamedString": "foo",
        "myString": "foo",
        "myStruct": {"myKeyA": "myStructKeyA", "myKeyB": 888},
        "myUnion": {"caseA": "myCaseAString"}
      }
    )
    .expectJSONTypes({
      myRef: String
    })
    .inspectBody()
    .afterJSON(function (json) {
      getTestModel(signature)
    })
    .toss();
}

function getRefModelRecords (signature) {
  frisby.create('get model entires')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "all": {
              "tag": "refTestModel"
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
    .expectJSON(
      {
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
          "myString": {
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

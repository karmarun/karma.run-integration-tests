require('dotenv').config();
const frisby = require('frisby');


const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const dbName = 'db-api-test-continuous-migrations'
const dbNameBody = '"' + dbName + '"'

let signature = null;
let modelIds = null;

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
                          },
                          "myOptional": {
                            "optional": {
                              "string": {}
                            }
                          },
                          "myRef": {
                            "ref": "refTestModel"
                          }
                        }
                      }
                    },
                    "testModelMigrated": {
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
                              },
                              "myKeyB": {
                                "int": {}
                              }
                            }
                          },
                          "myRef": {
                            "ref": "refTestModel"
                          },
                          "myNewBool": {
                            "bool": {}
                          },
                          "myNewInt": {
                            "int": {}
                          },
                          "myNewFloat": {
                            "float": {}
                          },
                          "myRenamedString": {
                            "string": {}
                          },
                          "myNewString": {
                            "string": {}
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
                    },
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
      getModelIDs(signature)
    })
    .toss();
}

function getModelIDs (signature) {
  frisby.create('function create model')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "all": {
              "tag": "_tag"
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
      modelIds = json.reduce(function (obj1, obj2) {
        obj1[obj2.tag] = obj2.model
        return obj1
      }, {})
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
                    "myOptional": "optional string",
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
                },
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
  frisby.create('function create _migration with invalidKey')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "create": {
              "in": {
                "tag": "_migration"
              },
              "value": {
                "newStruct": {
                  "from": {
                    "tag": "testModel"
                  },
                  "to": {
                    "tag": "testModelMigrated"
                  },
                  "expression": {
                    "create": {
                      "in": {
                        "tag": "_expression"
                      },
                      "value": {
                        "static": {
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
                            "myUnion": {
                              "field": "myUnion"
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
                                },
                                "invalidKey": {
                                  "newString": "this struct key should not fit in the new model"
                                }
                              }
                            },
                            "myRef": {
                              "field": "myRef"
                            },
                            "myNewBool": {
                              "newBool": true
                            },
                            "myNewInt": {
                              "floatToInt": {
                                "field": "myFloat"
                              }
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
                            "myRenamedString": {
                              "field": "myString"
                            },
                            "myNewString": {
                              "newString": "Lorem ipsum"
                            },
                            "invalidKey": {
                              "newString": "this struct key should not fit in the new model"
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
      getTestModelDefinition(signature)
    })
    .toss();
}


function getTestModelDefinition (signature) {
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
                      "tag": "testModelMigrated"
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
    .waits(10 * 1000)
    .expectStatus(200)
    .expectJSON(
      {
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
              },
              "myKeyB": {
                "int": {}
              }
            }
          },
          "myNewBool": {
            "bool": {}
          },
          "myNewInt": {
            "int": {}
          },
          "myNewFloat": {
            "float": {}
          },
          "myRenamedString": {
            "string": {}
          },
          "myNewString": {
            "string": {}
          },
          "myRef": {
            "ref": modelIds.refTestModel
          }
        }
      }
    )
    .afterJSON(function () {
      getTestModelMigratedFooRecord(signature)
      getTestModelMigratedBarRecord(signature)
    })
    .toss();
}

function getTestModelMigratedFooRecord (signature) {
  frisby.create('getTestModelMigratedFooRecord')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "first": {
              "filter": {
                "value": {
                  "all": {
                    "tag": "testModelMigrated"
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
    .expectJSON({
        "myFloat": 5.55,
        "myInt": 555,
        "myNewBool": true,
        "myNewFloat": 560.55,
        "myNewInt": 5,
        "myNewString": "Lorem ipsum",
        "myRenamedString": "foo",
        "myString": "foo",
        "myStruct": {
          "myKeyA": "myStructKeyA",
          "myKeyB": 888
        },
        "myUnion": {
          "caseA": "myCaseAString"
        }
      }
    )
    .expectJSONTypes({
      myRef: String
    })
    .toss();
}

function getTestModelMigratedBarRecord (signature) {
  frisby.create('getTestModelMigratedBarRecord')
    .post(KARMA_ENDPOINT, null,
      {
        json: false,
        body: JSON.stringify(
          {
            "first": {
              "filter": {
                "value": {
                  "all": {
                    "tag": "testModelMigrated"
                  }
                },
                "expression": {
                  "equal": [
                    "bar",
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
    .expectJSON({
        "myFloat": 5.55,
        "myInt": 555,
        "myNewBool": true,
        "myNewFloat": 560.55,
        "myNewInt": 5,
        "myNewString": "Lorem ipsum",
        "myRenamedString": "bar",
        "myString": "bar",
        "myStruct": {
          "myKeyA": "myStructKeyA",
          "myKeyB": 888
        },
        "myUnion": {
          "caseA": "myCaseAString"
        }
      }
    )
    .expectJSONTypes({
      myRef: String
    })
    .toss();
}

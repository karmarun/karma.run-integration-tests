import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

const DB_NAME = 'db-api-test-crud'
const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const recordIdRegex = /^[\S]{10,}$/
const karmaApi = new KarmaApi(KARMA_ENDPOINT)
let recordId = null
let record = {
  "string": "example text",
  "int": 1,
  "float": 0.5,
  "dateTime": "2017-08-02T00:00:00+03:00",
  "bool": true,
  "enum": "bar",
  "tuple": [
    5,
    "example tuple"
  ],
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
  "struct": {
    "fieldA": "a",
    "filedB": "b"
  },
  "union": {
    "variantA": {
      "intA": 1,
      "stringA": "a"
    }
  },
  "or": 222,
  "set": [1, 2, 3],
  "unique": "unique",
  "any": "any",
  "recursion": {
    "payload": 1,
    "next": {
      "payload": 2,
      "next": {
        "payload": 3,
        "next": {
          "payload": 4,
          "next": {
            "payload": 5,
            "next": {
              "payload": 6
            }
          }
        }
      }
    }
  },
  "recursive": {
    "foo": {
      "bar": 1,
      "zap": {
        "foo": {
          "bar": 2,
          "zap": {
            "foo": {
              "bar": 3
            },
            "bar": 3
          }
        },
        "bar": 2
      }
    },
    "bar": 1
  },
  "annotation": "annotated"
}

function compareResponse(t, response, expected) {
  t.is(response.status, 200, JSON.stringify(response.body))
  t.is(response.body.string, expected.string)
  t.is(response.body.int, expected.int)
  t.is(response.body.float, expected.float)
  t.is(response.body.dateTime, expected.dateTime)
  t.is(response.body.bool, expected.bool)
  t.is(response.body.enum, expected.enum)
  t.deepEqual(response.body.tuple, expected.tuple)
  t.deepEqual(response.body.list, expected.list)
  t.deepEqual(response.body.map, expected.map)
  t.deepEqual(response.body.struct, expected.struct)
  t.deepEqual(response.body.union, expected.union)
  t.deepEqual(response.body.or, expected.or)
  t.deepEqual(response.body.set.sort(), expected.set.sort())
  if (expected.optional) {
    t.is(response.body.optional, expected.optional)
  }
  else {
    t.falsy(response.body.optional)
  }
  t.is(response.body.any, expected.any)
  t.deepEqual(response.body.recursion, expected.recursion)
  t.deepEqual(response.body.recursive, expected.recursive)
}


//**********************************************************************************************************************
// Init Tests
//**********************************************************************************************************************

test.before(async t => {
  await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.instanceAdministratorRequest('/root/create_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200, JSON.stringify(response.body))
})


//**********************************************************************************************************************
// Start Tests
//**********************************************************************************************************************

test.serial('create model', async t => {
  const response = await karmaApi.tQuery(t, {
    "create": {
      "in": {
        "tag": "_tag"
      },
      "value": {
        "newStruct": {
          "tag": "tagTest",
          "model": {
            "create": {
              "in": {
                "tag": "_model"
              },
              "value": {
                "contextual": {
                  "struct": {
                    "string": {
                      "string": {}
                    },
                    "int": {
                      "int": {}
                    },
                    "float": {
                      "float": {}
                    },
                    "dateTime": {
                      "dateTime": {}
                    },
                    "bool": {
                      "bool": {}
                    },
                    "enum": {
                      "enum": [
                        "foo",
                        "bar",
                        "pop"
                      ]
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
                    "or": {
                      "or": [
                        {
                          "int": {}
                        },
                        {
                          "string": {}
                        }
                      ]
                    },
                    "set": {
                      "set": {
                        "int": {}
                      }
                    },
                    "optional": {
                      "optional": {
                        "string": {}
                      }
                    },
                    "unique": {
                      "unique": {
                        "string": {}
                      }
                    },
                    "any": {
                      "any": {}
                    },
                    "recursion": {
                      "recursion": {
                        "label": "self",
                        "model": {
                          "struct": {
                            "payload": {
                              "int": {}
                            },
                            "next": {
                              "optional": {
                                "recurse": "self"
                              }
                            }
                          }
                        }
                      }
                    },
                    "recursive": {
                      "recursive": {
                        "top": "S",
                        "models": {
                          "S": {
                            "struct": {
                              "foo": {
                                "recurse": "T"
                              },
                              "bar": {
                                "recurse": "U"
                              }
                            }
                          },
                          "T": {
                            "struct": {
                              "bar": {
                                "recurse": "U"
                              },
                              "zap": {
                                "optional": {
                                  "recurse": "S"
                                }
                              }
                            }
                          },
                          "U": {
                            "int": {}
                          }
                        }
                      }
                    },
                    "annotation": {
                      "annotation": {
                        "value": "ui:slider(-103,205)",
                        "model": {
                          "string": {}
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
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body, recordIdRegex)
})

test.serial('create record', async t => {
  const response = await karmaApi.tQuery(t, {
    "create": {
      "in": {
        "tag": "tagTest"
      },
      "value": {
        "contextual": record
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body, recordIdRegex)
  recordId = response.body
})

test.serial('create same record again', async t => {
  const response = await karmaApi.tQuery(t, {
    "create": {
      "in": {
        "tag": "tagTest"
      },
      "value": {
        "contextual": record
      }
    }
  })
  t.is(response.status, 400, 'should fail because of unique object')
})

test.serial('check record', async t => {
  const response = await karmaApi.tQuery(t, {
    "get": {
      "newRef": {
        "model": {
          "tag": "tagTest"
        },
        "id": recordId
      }
    }
  })
  compareResponse(t, response, record)
})

test.serial('update record but without any changes', async t => {
  // useful to check if it's possible to update unique objects
  const response = await karmaApi.tQuery(t, {
    "update": {
      "ref": {
        "newRef": {
          "model": {
            "tag": "tagTest"
          },
          "id": recordId
        }
      },
      "value": {
        "contextual": record
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.is(response.body, recordId)
})

test.serial('check record', async t => {
  const response = await karmaApi.tQuery(t, {
    "get": {
      "newRef": {
        "model": {
          "tag": "tagTest"
        },
        "id": recordId
      }
    }
  })
  compareResponse(t, response, record)
})

test.serial('update record with changes', async t => {
  record.string += "updated"
  record.or = "string"
  record.optional = "optional"
  record.unique += "updated"
  const response = await karmaApi.tQuery(t, {
    "update": {
      "ref": {
        "newRef": {
          "model": {
            "tag": "tagTest"
          },
          "id": recordId
        }
      },
      "value": {
        "contextual": record
      }
    }
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.is(response.body, recordId)
})

test.serial('check record', async t => {
  const response = await karmaApi.tQuery(t, {
    "get": {
      "newRef": {
        "model": {
          "tag": "tagTest"
        },
        "id": recordId
      }
    }
  })
  compareResponse(t, response, record)
})


test.serial('create multiple with some cyclic references', async t => {
  const response = await karmaApi.tQuery(t, {
    "do": {
      "createModels": {
        "createMultiple": {
          "in": {
            "tag": "_model"
          },
          "values": {
            "a": {
              "contextual": {
                "struct": {
                  "string": {
                    "string": {}
                  },
                  "ref": {
                    "ref": "b"
                  }
                }
              }
            },
            "b": {
              "contextual": {
                "struct": {
                  "int": {
                    "int": {}
                  },
                  "ref": {
                    "ref": "c"
                  }
                }
              }
            },
            "c": {
              "contextual": {
                "struct": {
                  "float": {
                    "float": {}
                  },
                  "ref": {
                    "ref": "a"
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
                "field": "key"
              },
              "model": {
                "field": "value"
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
  })
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body.a, recordIdRegex)
  t.regex(response.body.b, recordIdRegex)
  t.regex(response.body.c, recordIdRegex)
})

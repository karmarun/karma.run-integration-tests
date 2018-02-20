import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const recordIdRegex = /^[\S]{10,}$/
const karmaApi = new KarmaApi(KARMA_ENDPOINT)
let recordId = null
let record = [
  "struct", {
    "string": ["string", "example text"],
  }
]

function compareResponse (t, response, expected) {
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
  await karmaApi.signIn('', 'admin', KARMA_INSTANCE_SECRET)
  await karmaApi.instanceAdministratorRequestKBullshit('admin/reset')
  await karmaApi.signIn('', 'admin', KARMA_INSTANCE_SECRET)
})


//**********************************************************************************************************************
// Start Tests
//**********************************************************************************************************************

test('all', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "all", ["tag", ["string", "_tag"]]
    ])
  t.is(response.status, 200)
})

test.serial('create model', async t => {
  const qu = {
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
  }
  const createModel = [
    "create", {
      "in": [
        "tag", ["string", "_model"]
      ],
      "value": [
        "union",
        [
          "struct", [
          "map", {
            "string": [
              "union", [
                "string",
                ["struct", {}],
              ]
            ]
          }]
        ]
      ]
    }
  ]
  const createTag = [
    "create", {
      "in": [
        "tag", ["string", "_tag"]
      ],
      "value": [
        "struct",
        {
          "tag": ["string", "tagTest"],
          "model": createModel
        }
      ]
    }
  ]
  const response = await karmaApi.tQuery(t, createTag)
  t.is(response.status, 200, JSON.stringify(response.body))
  //t.truthy(response.body is A)
})

test.serial('create record', async t => {
  const response = await karmaApi.tQuery(t, [
    "create", {
      "in": [
        "tag", ["string", "tagTest"]
      ],
      "value": record
    }
  ])
  //console.log(response.body[1].human)
  t.is(response.status, 200, JSON.stringify(response.body))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
  recordId = response.body
})
//
// test.serial('create same record again', async t => {
//   const response = await karmaApi.tQuery(t, {
//     "create": {
//       "in": {
//         "tag": "tagTest"
//       },
//       "value": {
//         "contextual": record
//       }
//     }
//   })
//   t.is(response.status, 400, 'should fail because of unique object')
// })
//
// test.serial('check record', async t => {
//   const response = await karmaApi.tQuery(t, {
//     "get": {
//       "newRef": {
//         "model": {
//           "tag": "tagTest"
//         },
//         "id": recordId
//       }
//     }
//   })
//   compareResponse(t, response, record)
// })
//
// test.serial('update record but without any changes', async t => {
//   // useful to check if it's possible to update unique objects
//   const response = await karmaApi.tQuery(t, {
//     "update": {
//       "ref": {
//         "newRef": {
//           "model": {
//             "tag": "tagTest"
//           },
//           "id": recordId
//         }
//       },
//       "value": {
//         "contextual": record
//       }
//     }
//   })
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.is(response.body, recordId)
// })
//
// test.serial('check record', async t => {
//   const response = await karmaApi.tQuery(t, {
//     "get": {
//       "newRef": {
//         "model": {
//           "tag": "tagTest"
//         },
//         "id": recordId
//       }
//     }
//   })
//   compareResponse(t, response, record)
// })
//
// test.serial('update record with changes', async t => {
//   record.string += "updated"
//   record.or = "string"
//   record.optional = "optional"
//   record.unique += "updated"
//   const response = await karmaApi.tQuery(t, {
//     "update": {
//       "ref": {
//         "newRef": {
//           "model": {
//             "tag": "tagTest"
//           },
//           "id": recordId
//         }
//       },
//       "value": {
//         "contextual": record
//       }
//     }
//   })
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.is(response.body, recordId)
// })
//
// test.serial('check record', async t => {
//   const response = await karmaApi.tQuery(t, {
//     "get": {
//       "newRef": {
//         "model": {
//           "tag": "tagTest"
//         },
//         "id": recordId
//       }
//     }
//   })
//   compareResponse(t, response, record)
// })
//
//
// test.serial('create multiple with some cyclic references', async t => {
//   const response = await karmaApi.tQuery(t, {
//     "do": {
//       "createModels": {
//         "createMultiple": {
//           "in": {
//             "tag": "_model"
//           },
//           "values": {
//             "a": {
//               "contextual": {
//                 "struct": {
//                   "string": {
//                     "string": {}
//                   },
//                   "ref": {
//                     "ref": "b"
//                   }
//                 }
//               }
//             },
//             "b": {
//               "contextual": {
//                 "struct": {
//                   "int": {
//                     "int": {}
//                   },
//                   "ref": {
//                     "ref": "c"
//                   }
//                 }
//               }
//             },
//             "c": {
//               "contextual": {
//                 "struct": {
//                   "float": {
//                     "float": {}
//                   },
//                   "ref": {
//                     "ref": "a"
//                   }
//                 }
//               }
//             }
//           }
//         }
//       },
//       "createTag": {
//         "create": {
//           "in": {
//             "tag": "_tag"
//           },
//           "value": {
//             "newStruct": {
//               "tag": {
//                 "field": "key"
//               },
//               "model": {
//                 "field": "value"
//               }
//             }
//           }
//         }
//       },
//       "return": {
//         "mapMap": {
//           "value": {
//             "bind": "createModels"
//           },
//           "expression": {
//             "bind": "createTag"
//           }
//         }
//       }
//     }
//   })
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.regex(response.body.a, recordIdRegex)
//   t.regex(response.body.b, recordIdRegex)
//   t.regex(response.body.c, recordIdRegex)
// })

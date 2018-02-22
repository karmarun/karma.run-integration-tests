import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')
const m = require('./tools/_model.js')

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const recordIdRegex = /^[\S]{10,}$/
const karmaApi = new KarmaApi(KARMA_ENDPOINT)
let recordId = null

let recordResponse = {
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

let record = [
  "struct", {
    "string": ["string", "example text"],
    "int": ["int32", 1],
    "float": ["float", 1],
    "dateTime": ["dateTime", "2017-08-02T00:00:00+03:00"],
    "bool": ["bool", true],
    // "enum": [
    //   "enum",
    //   "bar"
    // ],
    "tuple": [
      "tuple", [
        ["int32", 5],
        ["string", "example tuple"],
      ]
    ],
    "list": [
      "list", [
        ["struct", {
          "fieldA": ["string", "a"],
          "filedB": ["string", "b"]
        }
        ]
      ]
    ],
    "map": [
      "map", {
        "a": ["string", "a"],
        "b": ["string", "b"]
      }
    ],
    "struct": [
      "struct", {
        "fieldA": ["string", "a"],
        "filedB": ["string", "b"]
      }
    ],
    "union": [
      "union", [
        "variantA", [
          "struct", {
            "intA": ["int32", 1],
            "stringA": ["string", "a"]
          }
        ]
      ]
    ],
    "set": [
      "set", [["int32", 1], ["int32", 2], ["int32", 3]]
    ],
    "unique": ["string", "unique"],
    // "any": ["string", "any"],
    "recursion": [
      "struct", {
        "payload": ["int32", 1],
        "next": [
          "struct", {
            "payload": ["int32", 2],
            "next": [
              "struct", {
                "payload": ["int32", 3],
                "next": [
                  "struct", {
                    "payload": ["int32", 4],
                    "next": [
                      "struct", {
                        "payload": ["int32", 5],
                        "next": [
                          "struct", {
                            "payload": ["int32", 6]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "recursive": [
      "struct", {
        "foo": [
          "struct", {
            "bar": ["int32", 1],
            "zap": [
              "struct", {
                "foo": [
                  "struct", {
                    "bar": ["int32", 2],
                    "zap": [
                      "struct", {
                        "foo": [
                          "struct", {
                            "bar": ["int32", 3]
                          }
                        ],
                        "bar": ["int32", 3]
                      }
                    ]
                  }
                ],
                "bar": ["int32", 2]
              }
            ]
          }
        ],
        "bar": ["int32", 1]
      }
    ],
    "annotation": ["string", "annotated"],
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

test('all model', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "all", ["tag", ["string", "_model"]]
    ])
  t.is(response.status, 200)
})

test.serial('create model', async t => {

  const createModel = [
    "create", {
      "in": [
        "tag", ["string", "_model"]
      ],
      "value": m.struct({
        "string": m.string(),
        "int": m.int32(),
        "float": m.float(),
        "dateTime": m.dateTime(),
        "bool": m.bool(),
        // "enum": m.enum([
        //   ["string", "foo"],
        //   ["string", "bar"],
        //   ["string", "pop"],
        // ]),
        "tuple": m.tuple([
          m.int32(),
          m.string(),
        ]),
        "list": m.list(
          m.struct({
            "fieldA": m.string(),
            "filedB": m.string()
          })
        ),
        "map": m.map(
          m.string()
        ),
        "struct": m.struct({
          "fieldA": m.string(),
          "filedB": m.string()
        }),
        "union": m.union({
          "variantA": m.struct({
            "stringA": m.string(),
            "intA": m.int32()
          }),
          "variantB": m.struct({
            "stringB": m.string(),
            "intB": m.int32()
          })
        }),
        "set": m.set(
          m.int32()
        ),
        "optional": m.optional(
          m.string()
        ),
        "unique": m.unique(
          m.string()
        ),
        // "any": m.any(),
        "annotation": m.annotation(
          "ui:slider(-103,205)",
          m.string()
        ),
        "recursion": m.recursion(
          "self",
          m.struct({
            "payload": m.int32(),
            "next": m.optional(m.recurse("self"))
          })
        ),
        "recursive": m.recursive("S",
          {
            "S": m.struct({
              "foo": m.recurse("T"),
              "bar": m.recurse("U")
            }),
            "T": m.struct({
              "bar": m.recurse("U"),
              "zap": m.optional(
                m.recurse("S")
              )
            }),
            "U": m.int32()
          }
        )
      })
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
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
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
//   compareResponse(t, response, recordResponse)
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

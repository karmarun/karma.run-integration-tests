import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')
const f = require('./tools/_function.js')
const m = require('./tools/_model.js')
const e = require('./tools/_expressions.js')
const d = require('./tools/_data.js')

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const recordIdRegex = /^[\S]{10,}$/
const karmaApi = new KarmaApi(KARMA_ENDPOINT)


//**********************************************************************************************************************
// init Tests
//**********************************************************************************************************************

test.before(async t => {
  await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
  await karmaApi.instanceAdministratorRequest('admin/reset')
  await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
})


//**********************************************************************************************************************
// some simple examples for the karma documentation
//**********************************************************************************************************************

test.serial('get', async t => {
  const query = e.get(e.refTo(e.first(e.all(e.tag(d.string('_tag'))))))
  const response = await karmaApi.tQuery(t, 'get_0', query)
  t.truthy(response.body.model)
  t.truthy(response.body.tag)
})


test('metarialize', async t => {
  const query = e.metarialize(e.first(e.all(e.tag(d.string('_tag')))))
  const response = await karmaApi.tQuery(t, 'metarialize_0', query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.truthy(response.body.created)
  t.truthy(response.body.updated)
  t.truthy(response.body.id)
  t.truthy(response.body.model)
  t.truthy(response.body.value)
})


test.serial('create', async t => {
  const query = e.create(e.tag(d.string('_model')), f.karmaFunction(['param'],
    d.data(m.struct({
      "myString": m.string(),
      "myInt": m.int32(),
      "myBool": m.bool()
    }))
  ))
  const response = await karmaApi.tQuery(t, 'create_0', query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})


test.serial('nested create', async t => {
  const createModel = e.create(
    e.tag(d.string('_model')),
    f.karmaFunction(['param'],
      d.data(m.struct({
        "myString": m.string(),
        "myInt": m.int32(),
        "myBool": m.bool()
      }))
    ))

  const createTag = e.create(
    e.tag(d.string('_tag')),
    f.karmaFunction(['param'],
      d.data(d.struct({
        "tag": d.string('myModel'),
        "model": e.expr(e.scope('myNewModel'))
      }))
    ))

  const query = [
    e.define('myNewModel', createModel),
    createTag
  ]

  const response = await karmaApi.tQuery(t, 'create_1', ...query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})


test.serial('create record', async t => {
  const create = e.create(
    e.tag(d.string('myModel')),
    f.karmaFunction(['param'],
      d.data(d.struct({
        "myString": d.string('my string content'),
        "myInt": d.int32(333),
        "myBool": d.bool(true)
      }))
    )
  )
  const response = await karmaApi.tQuery(t, 'create_2', create)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})


test.serial('update', async t => {
  const query = e.update(
    e.refTo(e.first(e.all(e.tag(d.string('myModel'))))),
    d.data(d.struct({
      "myString": d.string('my updated string content'),
      "myInt": d.int32(777),
      "myBool": d.bool(false)
    }))
  )
  const response = await karmaApi.tQuery(t, 'update_0', query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})


test.serial('get', async t => {
  const query = e.get(e.refTo(e.first(e.all(e.tag(d.string('myModel'))))))
  const response = await karmaApi.tQuery(t, 'get_1', query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.deepEqual(response.body, {
    myBool: false,
    myInt: 777,
    myString: 'my updated string content'
  })
})


test.serial('delete', async t => {
  const query3 = e.delete(
    e.refTo(e.first(e.all(e.tag(d.string('myModel')))))
  )
  const response = await karmaApi.tQuery(t, 'delete_0', query3)
  t.is(response.status, 200, karmaApi.printError(response))
  t.deepEqual(response.body, {
      myBool: false,
      myInt: 777,
      myString: 'my updated string content'
    }
  )
})

test('zero', async t => {
  const create = e.create(
    e.tag(d.string('myModel')),
    f.karmaFunction(['param'],
      d.zero()
    )
  )
  const response = await karmaApi.tQuery(t, 'create_2', create)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})

// test.serial('create multiple record', async t => {
//   const create = [
//     "createMultiple",
//     {
//       "in": [
//         "tag",
//         [
//           "string",
//           "myModel"
//         ]
//       ],
//       "values": {
//         "a": [
//           "struct",
//           {
//             "myString": ["string", "a"],
//             "myInt": ["int32", 1],
//             "myBool": ["bool", true]
//           }
//         ],
//         "b": [
//           "struct",
//           {
//             "myString": ["string", "b"],
//             "myInt": ["int32", 2],
//             "myBool": ["bool", false]
//           }
//         ]
//       }
//     }
//   ]
//
//   const response = await karmaApi.tQuery(t, '', create)
//   t.is(response.status, 200, karmaApi.printError(response))
//   t.regex(response.body.a[0], recordIdRegex)
//   t.regex(response.body.a[1], recordIdRegex)
//   t.regex(response.body.b[0], recordIdRegex)
//   t.regex(response.body.b[1], recordIdRegex)
// })


//**********************************************************************************************************************
// some tests which should contain all possible model types
//**********************************************************************************************************************
let recordRef = null

function compareResponse (t, response, expected) {
  t.is(response.status, 200)
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
  t.deepEqual(response.body.set.sort(), expected.set.sort())
  if (expected.optional) {
    t.is(response.body.optional, expected.optional)
  }
  else {
    t.falsy(response.body.optional)
  }
  t.deepEqual(response.body.recursion, expected.recursion)
  t.deepEqual(response.body.recursive, expected.recursive)
}


let recordUntyped = {
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
  "recursion": {
    "payload": 1,
    "next": {
      "payload": 2,
      "next": {
        "payload": 3,
        "next": null
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
              "bar": 3,
              "zap": null
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
let recordTyped = d.struct({
  "string": d.string("example text"),
  "int": d.int32(1),
  "float": d.float(0.5),
  "dateTime": d.dateTime("2017-08-02T00:00:00+03:00"),
  "bool": d.bool(true),
  "enum": d.symbol("bar"),
  "tuple": d.tuple(
    d.int32(5),
    d.string("example tuple")
  ),
  "list": d.list(
    d.struct({
      "fieldA": d.string("a"),
      "filedB": d.string("b")
    })
  ),
  "map": d.map({
    "a": d.string("a"),
    "b": d.string("b")
  }),
  "struct": d.struct({
    "fieldA": d.string("a"),
    "filedB": d.string("b")
  }),
  "union": d.union(
    "variantA", d.struct({
      "intA": d.int32(1),
      "stringA": d.string("a")
    })
  ),
  "set": d.set(d.int32(1), d.int32(2), d.int32(3)),
  "unique": d.string("unique"),
  "recursion": d.struct({
    "payload": d.int32(1),
    "next": d.struct({
      "payload": d.int32(2),
      "next": d.struct({
        "payload": d.int32(3)
      })
    })
  }),
  "recursive": d.struct({
    "foo": d.struct({
      "bar": d.int32(1),
      "zap": d.struct({
        "foo": d.struct({
          "bar": d.int32(2),
          "zap": d.struct({
            "foo": d.struct({
              "bar": d.int32(3)
            }),
            "bar": d.int32(3)
          })
        }),
        "bar": d.int32(2)
      })
    }),
    "bar": d.int32(1)
  }),
  "annotation": d.string("annotated"),
})


test.serial('create model', async t => {
  const createModel = e.create(e.tag(d.string('_model')),
    f.karmaFunction(["param"],
      d.data(m.struct({
        "string": m.string(),
        "int": m.int32(),
        "float": m.float(),
        "dateTime": m.dateTime(),
        "bool": m.bool(),
        "enum": m.enum(
          d.string('foo'),
          d.string('bar'),
          d.string('pop'),
        ),
        "tuple": m.tuple(
          m.int32(),
          m.string(),
        ),
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
      }))
    )
  )

  const createTag = e.create(
    e.tag(d.string('_tag')),
    f.karmaFunction(['param'],
      d.data(d.struct({
        "tag": d.string('tagTest'),
        "model": e.expr(e.scope('tagTestModel'))
      }))
    )
  )

  const query = [
    e.define('tagTestModel', createModel),
    createTag
  ]

  const response = await karmaApi.tQuery(t, '', ...query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})


test.serial('create record', async t => {
  const query = e.create(
    e.tag(d.string('tagTest')),
    f.karmaFunction(['param'],
      d.data(recordTyped)
    ))
  const response = await karmaApi.tQuery(t, '', query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
  recordRef = response.body
})


test.serial('create same record again', async t => {
  const query = e.create(
    e.tag(d.string('tagTest')),
    f.karmaFunction(['param'],
      d.data(recordTyped)
    ))
  const response = await karmaApi.tQuery(t, '', query)
  t.is(response.status, 400, 'should fail because of unique object')
})


test.serial('check record', async t => {
  const query = e.first(e.all(e.tag(d.string("tagTest"))))
  const response = await karmaApi.tQuery(t, '', query)
  t.is(response.status, 200, karmaApi.printError(response))
  compareResponse(t, response, recordUntyped)
})


test.serial('update record but without any changes', async t => {
  const query = e.update(
    e.refTo(e.first(e.all(e.tag(d.string('tagTest'))))),
    d.data(recordTyped)
  )
  const response = await karmaApi.tQuery(t, '', query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body[1], recordRef[1])
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})


test.serial('check record', async t => {
  const query = e.first(e.all(e.tag(d.string("tagTest"))))
  const response = await karmaApi.tQuery(t, '', query)
  t.is(response.status, 200, karmaApi.printError(response))
  compareResponse(t, response, recordUntyped)
})


test.serial('update record with changes', async t => {
  recordTyped.struct.string = d.string('updated')
  recordTyped.struct.optional = d.string('optional')
  recordTyped.struct.unique = d.string('updated')

  recordUntyped.string = "updated"
  recordUntyped.optional = "optional"
  recordUntyped.unique = "updated"

  const query = e.update(
    e.refTo(e.first(e.all(e.tag(d.string('tagTest'))))),
    d.data(recordTyped)
  )
  const response = await karmaApi.tQuery(t, '', query)
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body[1], recordRef[1])
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})


test.serial('check record', async t => {
  const query = e.first(e.all(e.tag(d.string("tagTest"))))
  const response = await karmaApi.tQuery(t, '', query)
  t.is(response.status, 200, karmaApi.printError(response))
  compareResponse(t, response, recordUntyped)
})


// test.serial('create multiple with some cyclic references', async t => {
//   const response = await karmaApi.tQuery(t, '', {
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
//   t.is(response.status, 200, karmaApi.printError(response))
//   t.regex(response.body.a, recordIdRegex)
//   t.regex(response.body.b, recordIdRegex)
//   t.regex(response.body.c, recordIdRegex)
// })

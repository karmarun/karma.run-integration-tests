import { ExecutionContext } from 'ava'
import { data as d, expression as e, model as m, func as f, KarmaError, KarmaErrorType } from 'karma.run'
import test, { QueryTestContext, recordIDRegex } from '../_before'

test.serial('get', async t => {
  const response = await t.context.exampleQuery(
    'get_0',
    e.get(e.refTo(e.first(e.all(e.tag(d.string('_tag'))))))
  )

  t.truthy(response.model)
  t.truthy(response.tag)
})

test('metarialize', async t => {
  const response = await t.context.exampleQuery(
    'metarialize_0',
    e.metarialize(e.first(e.all(e.tag(d.string('_tag')))))
  )

  t.truthy(response.created)
  t.truthy(response.updated)
  t.truthy(response.id)
  t.truthy(response.model)
  t.truthy(response.value)
})

test.serial('model create', async t => {
  const response = await t.context.exampleQuery(
    'create_0',
    e.create(e.tag(d.string('_model')), f.func(['param'],
      d.data(m.struct({
        'myString': m.string(),
        'myInt': m.int32(),
        'myBool': m.bool()
      }))
    ))
  )

  t.regex(response[0], recordIDRegex)
  t.regex(response[1], recordIDRegex)
})

test.serial('nested create', async t => {
  const createModel = e.create(
    e.tag(d.string('_model')),
    f.func(['param'],
      d.data(m.struct({
        'myString': m.string(),
        'myInt': m.int32(),
        'myBool': m.bool()
      }))
    ))

  const createTag = e.create(
    e.tag(d.string('_tag')),
    f.func(['param'],
      d.data(d.struct({
        'tag': d.string('myModel'),
        'model': e.expr(f.scope('myNewModel'))
      }))
    ))

  const query = [
    e.define('myNewModel', createModel),
    createTag
  ]

  const response = await t.context.exampleQuery(
    'create_1',
    ...query
  )

  t.regex(response[0], recordIDRegex)
  t.regex(response[1], recordIDRegex)
})

test.serial('create record', async t => {
  const response = await t.context.exampleQuery(
    'create_2',
    e.create(
      e.tag(d.string('myModel')),
      f.func(['param'],
        d.data(d.struct({
          'myString': d.string('my string content'),
          'myInt': d.int32(333),
          'myBool': d.bool(true)
        }))
      )
    )
  )

  t.regex(response[0], recordIDRegex)
  t.regex(response[1], recordIDRegex)
})


test.serial('update', async t => {
  const updateResponse = await t.context.exampleQuery(
    'update_0',
    e.update(
      e.refTo(e.first(e.all(e.tag(d.string('myModel'))))),
      d.data(d.struct({
        'myString': d.string('my updated string content'),
        'myInt': d.int32(777),
        'myBool': d.bool(false)
      }))
    )
  )

  t.regex(updateResponse[0], recordIDRegex)
  t.regex(updateResponse[1], recordIDRegex)

  const getResponse = await t.context.exampleQuery(
    'get_1',
    e.get(e.refTo(e.first(e.all(e.tag(d.string('myModel'))))))
  )

  t.deepEqual(getResponse, {
    myBool: false,
    myInt: 777,
    myString: 'my updated string content'
  })
})

test.serial('delete', async t => {
  const response = await t.context.exampleQuery(
    'delete_0',
    e.del(
      e.refTo(e.first(e.all(e.tag(d.string('myModel')))))
    )
  )

  t.deepEqual(response, {
      myBool: false,
      myInt: 777,
      myString: 'my updated string content'
    }
  )
})

test('zero', async t => {
  const response = await t.context.exampleQuery(
    'create_2',
    e.create(
      e.tag(d.string('myModel')),
      f.func(['param'],
        d.zero()
      )
    )
  )

  t.regex(response[0], recordIDRegex)
  t.regex(response[1], recordIDRegex)
})

test.serial('create multiple record', async t => {
  const response = await t.context.exampleQuery('createMultiple_0',
    e.createMultiple(
      e.tag(d.string('myModel')),
      {
        'a': f.func(['refs'], d.data(d.struct({
          'myString': d.string('a'),
          'myInt': d.int32(1),
          'myBool': d.bool(true)
        }))),

        'b': f.func(['refs'], d.data(d.struct({
          'myString': d.string('b'),
          'myInt': d.int32(2),
          'myBool': d.bool(false)
        })))
      }
    )
  )

  t.regex(response.a[0], recordIDRegex)
  t.regex(response.a[1], recordIDRegex)
  t.regex(response.b[0], recordIDRegex)
  t.regex(response.b[1], recordIDRegex)
})


// Some tests which should contain all possible model types
// ========================================================

let recordRef: any = null

function compareResponse(t: ExecutionContext<QueryTestContext>, response: any, expected: any) {
  t.is(response.string, expected.string)
  t.is(response.int, expected.int)
  t.is(response.float, expected.float)
  t.is(response.dateTime, expected.dateTime)
  t.is(response.bool, expected.bool)
  t.is(response.enum, expected.enum)
  t.deepEqual(response.tuple, expected.tuple)
  t.deepEqual(response.list, expected.list)
  t.deepEqual(response.map, expected.map)
  t.deepEqual(response.struct, expected.struct)
  t.deepEqual(response.union, expected.union)
  t.deepEqual(response.set.sort(), expected.set.sort())

  if (expected.optional) {
    t.is(response.optional, expected.optional)
  } else {
    t.falsy(response.optional)
  }

  t.deepEqual(response.recursion, expected.recursion)
  t.deepEqual(response.recursive, expected.recursive)
}


let recordUntyped = {
  'string': 'example text',
  'int': 1,
  'float': 0.5,
  'dateTime': '2017-08-02T00:00:00+03:00',
  'bool': true,
  'enum': 'bar',
  'tuple': [
    5,
    'example tuple'
  ],
  'list': [
    {
      'fieldA': 'a',
      'filedB': 'b'
    }
  ],
  'map': {
    'a': 'a',
    'b': 'b'
  },
  'struct': {
    'fieldA': 'a',
    'filedB': 'b'
  },
  'union': {
    'variantA': {
      'intA': 1,
      'stringA': 'a'
    }
  },
  'set': [1, 2, 3],
  'unique': 'unique',
  'recursion': {
    'payload': 1,
    'next': {
      'payload': 2,
      'next': {
        'payload': 3,
        'next': null
      }
    }
  },
  'recursive': {
    'foo': {
      'bar': 1,
      'zap': {
        'foo': {
          'bar': 2,
          'zap': {
            'foo': {
              'bar': 3,
              'zap': null
            },
            'bar': 3
          }
        },
        'bar': 2
      }
    },
    'bar': 1
  },
  'annotation': 'annotated'
}

let recordTyped = d.struct({
  'string': d.string('example text'),
  'int': d.int32(1),
  'float': d.float(0.5),
  'dateTime': d.dateTime('2017-08-02T00:00:00+03:00'),
  'bool': d.bool(true),
  'enum': d.symbol('bar'),
  'tuple': d.tuple(
    d.int32(5),
    d.string('example tuple')
  ),
  'list': d.list(
    d.struct({
      'fieldA': d.string('a'),
      'filedB': d.string('b')
    })
  ),
  'map': d.map({
    'a': d.string('a'),
    'b': d.string('b')
  }),
  'struct': d.struct({
    'fieldA': d.string('a'),
    'filedB': d.string('b')
  }),
  'union': d.union(
    'variantA', d.struct({
      'intA': d.int32(1),
      'stringA': d.string('a')
    })
  ),
  'set': d.set(d.int32(1), d.int32(2), d.int32(3)),
  'unique': d.string('unique'),
  'recursion': d.struct({
    'payload': d.int32(1),
    'next': d.struct({
      'payload': d.int32(2),
      'next': d.struct({
        'payload': d.int32(3)
      })
    })
  }),
  'recursive': d.struct({
    'foo': d.struct({
      'bar': d.int32(1),
      'zap': d.struct({
        'foo': d.struct({
          'bar': d.int32(2),
          'zap': d.struct({
            'foo': d.struct({
              'bar': d.int32(3)
            }),
            'bar': d.int32(3)
          })
        }),
        'bar': d.int32(2)
      })
    }),
    'bar': d.int32(1)
  }),
  'annotation': d.string('annotated'),
})

test.serial('create complex model', async t => {
  const createModel = e.create(e.tag(d.string('_model')),
    f.func(['param'],
      d.data(m.struct({
        'string': m.string(),
        'int': m.int32(),
        'float': m.float(),
        'dateTime': m.dateTime(),
        'bool': m.bool(),
        'enum': m.enumeration(
          d.string('foo'),
          d.string('bar'),
          d.string('pop'),
        ),
        'tuple': m.tuple(
          m.int32(),
          m.string(),
        ),
        'list': m.list(
          m.struct({
            'fieldA': m.string(),
            'filedB': m.string()
          })
        ),
        'map': m.map(
          m.string()
        ),
        'struct': m.struct({
          'fieldA': m.string(),
          'filedB': m.string()
        }),
        'union': m.union({
          'variantA': m.struct({
            'stringA': m.string(),
            'intA': m.int32()
          }),
          'variantB': m.struct({
            'stringB': m.string(),
            'intB': m.int32()
          })
        }),
        'set': m.set(
          m.int32()
        ),
        'optional': m.optional(
          m.string()
        ),
        'unique': m.unique(
          m.string()
        ),
        'annotation': m.annotation(
          'ui:slider(-103,205)',
          m.string()
        ),
        'recursion': m.recursion(
          'self',
          m.struct({
            'payload': m.int32(),
            'next': m.optional(m.recurse('self'))
          })
        ),
        'recursive': m.recursive('S',
          {
            'S': m.struct({
              'foo': m.recurse('T'),
              'bar': m.recurse('U')
            }),
            'T': m.struct({
              'bar': m.recurse('U'),
              'zap': m.optional(
                m.recurse('S')
              )
            }),
            'U': m.int32()
          }
        )
      }))
    )
  )

  const createTag = e.create(
    e.tag(d.string('_tag')),
    f.func(['param'],
      d.data(d.struct({
        'tag': d.string('tagTest'),
        'model': e.expr(f.scope('tagTestModel'))
      }))
    )
  )

  const modelQuery = [
    e.define('tagTestModel', createModel),
    createTag
  ]

  const modelResponse = await t.context.query(...modelQuery)

  t.regex(modelResponse[0], recordIDRegex)
  t.regex(modelResponse[1], recordIDRegex)

  // Create record
  const recordQuery = e.create(
    e.tag(d.string('tagTest')),
    f.func(['param'], d.data(recordTyped)
  ))

  const recordResponse = await t.context.query(recordQuery)

  t.regex(recordResponse[0], recordIDRegex)
  t.regex(recordResponse[1], recordIDRegex)

  recordRef = recordResponse

  // Check unique constraint
  const error: KarmaError = await t.throws(async () => {
    const query = e.create(
      e.tag(d.string('tagTest')),
      f.func(['param'],
        d.data(recordTyped)
      )
    )

    return await t.context.query(query)
  }, KarmaError)

  t.is(error.type, KarmaErrorType.ExecutionError)

  const checkQuery = e.first(e.all(e.tag(d.string('tagTest'))))
  let checkResponse = await t.context.query(checkQuery)

  compareResponse(t, checkResponse, recordUntyped)

  // Update without changes
  const updateQuery = e.update(
    e.refTo(e.first(e.all(e.tag(d.string('tagTest'))))),
    d.data(recordTyped)
  )

  const response = await t.context.query(updateQuery)

  t.is(response[1], recordRef[1])
  t.regex(response[0], recordIDRegex)
  t.regex(response[1], recordIDRegex)

  // Check record again
  checkResponse = await t.context.query(checkQuery)
  compareResponse(t, checkResponse, recordUntyped)

  // Update with changes
  recordTyped.struct.string = d.string('updated')
  recordTyped.struct.optional = d.string('optional')
  recordTyped.struct.unique = d.string('updated')

  recordUntyped.string = 'updated';
  (recordUntyped as any).optional = 'optional'
  recordUntyped.unique = 'updated'

  const changeQuery = e.update(
    e.refTo(e.first(e.all(e.tag(d.string('tagTest'))))),
    d.data(recordTyped)
  )
  const changeResponse = await t.context.query(changeQuery)

  t.is(changeResponse[1], recordRef[1])
  t.regex(changeResponse[0], recordIDRegex)
  t.regex(changeResponse[1], recordIDRegex)

  // Check record again
  checkResponse = await t.context.query(checkQuery)
  compareResponse(t, checkResponse, recordUntyped)
})

// test.serial('create multiple with some cyclic references', async t => {
//   const response = await t.context.query({
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

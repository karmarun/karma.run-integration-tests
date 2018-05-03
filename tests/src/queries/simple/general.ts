import { data as d, expression as e, KarmaError, KarmaErrorType } from 'karma.run'
import test from '../_before'

test('all', async t => {
  const response = await t.context.exampleQuery('all_0',
    e.all(e.tag(d.data(d.string('_tag'))))
  )

  t.true(Array.isArray(response))
})

test('after', async t => {
  const response = await t.context.exampleQuery('after_0',
    e.after([
      d.data(d.dateTime('2018-01-01T00:00:00Z')),
      d.data(d.dateTime('2017-01-01T00:00:00Z'))
    ])
  )

  t.is(response, true)
})

test('before', async t => {
  const response = await t.context.exampleQuery('before_0',
    e.before([
      d.data(d.dateTime('2017-01-01T00:00:00Z')),
      d.data(d.dateTime('2018-01-01T00:00:00Z'))
    ])
  )

  t.is(response, true)
})

test('length', async t => {
  const response = await t.context.exampleQuery('length_0',
    e.length(d.data(d.list(
      d.int8(1),
      d.int8(2),
      d.int8(3),
      d.int8(4),
      d.int8(5)
    ))))

  t.is(response, 5)
})

test('gtFloat', async t => {
  const response = await t.context.exampleQuery('greater_0',
    e.gtFloat(d.data(d.float(2.2)), d.data(d.float(2.1)))
  )

  t.is(response, true)
})

test('ltFloat', async t => {
  const response = await t.context.exampleQuery('less_0',
    e.ltFloat(d.data(d.float(1)), d.data(d.float(2)))
  )

  t.is(response, true)
})

test('equal', async t => {
  let response = await t.context.exampleQuery('equal_0',
    e.equal(d.string('foo'), d.string('foo'))
  )

  t.is(response, true)

  response = await t.context.exampleQuery('',
    e.equal(d.int16('123'), d.string('foo'))
  )

  t.is(response, false)
})

test('and', async t => {
  const response = await t.context.exampleQuery('and_0',
    e.and(
      e.equal(d.string('foo'), d.string('foo')),
      d.bool(true)
    )
  )

  t.is(response, true)
})

test('or', async t => {
  const response = await t.context.exampleQuery('or_0',
    e.or(
      e.equal(d.string('foo'), d.string('foo')),
      d.bool(true)
    )
  )

  t.is(response, true)
})

test('field', async t => {
  const response = await t.context.exampleQuery('field_0',
    e.field(
      'foo',
      d.data(d.struct({
        'foo': d.string('bar')
      }))
    )
  )

  t.is(response, 'bar')
})

test('key', async t => {
  const response = await t.context.exampleQuery('key_0',
    e.key(
      d.string('foo'),
      d.data(d.map({
        'foo': d.string('bar')
      }))
    )
  )

  t.is(response, 'bar')
})

test('not', async t => {
  const response = await t.context.exampleQuery('not_0',
    e.not(
      d.bool(false)
    )
  )

  t.is(response, true)
})

test('addInt8', async t => {
  const response = await t.context.exampleQuery('addInt8_0',
    e.addInt8(d.int8(2), d.int8(4))
  )

  t.is(response, 6)
})

test('subInt8', async t => {
  const response = await t.context.exampleQuery('subInt8',
    e.subInt8(d.int8(2), d.int8(4))
  )

  t.is(response, -2)
})

test('mulInt8', async t => {
  const response = await t.context.exampleQuery('mulInt8_0',
    e.mulInt8(d.int8(2), d.int8(4))
  )

  t.is(response, 8)
})

test('divInt8', async t => {
  const response = await t.context.exampleQuery('divInt8_0',
    e.divInt8(d.int8(4), d.int8(2))
  )

  t.is(response, 2)
})

test('assertPresent', async t => {
  const error: KarmaError = await t.throws(async () => {
    return await t.context.exampleQuery('assertPresent_0',
      e.assertPresent(
        e.key(
          d.string('notFoo'),
          d.data(d.map({
            'foo': d.string('bar')
          }))
        )
      )
    )
  }, KarmaError)

  t.is(error.type, KarmaErrorType.ExecutionError)

  const response = await t.context.exampleQuery('assertPresent_1',
    e.assertPresent(
      e.key(
        d.string('foo'),
        d.data(d.map({
          'foo': d.string('bar')
        }))
      )
    )
  )

  t.is(response, 'bar')
})

test('assertCase', async t => {
  const error: KarmaError = await t.throws(async () => {
    return await t.context.exampleQuery('assertCase_0',
      e.assertCase(
        'foo',
        d.data(d.union(
          'bar', d.int8(4),
        ))
      )
    )
  })

  t.is(error.type, KarmaErrorType.CompilationError)

  const response = await t.context.exampleQuery('assertCase_1',
    e.assertCase(
      'foo',
      d.data(d.union(
        'foo', d.int8(4),
      ))
    )
  )

  t.is(response, 4)
})

// test('with', async t => {
//   const response = await t.context.exampleQuery([
//     "with", {
//       "value": [
//         "struct", {
//           "valA": ["int32", 4],
//           "valB": ["int32", -6]
//         }
//       ],
//       "return": [
//         "add", [
//           [
//             "field",
//             {
//               "name": "valA",
//               "value": ["arg", {}]
//             }
//           ],
//           [
//             "field",
//             {
//               "name": "valB",
//               "value": ["arg", {}]
//             }
//           ]
//         ]
//       ]
//     }
//   ])
//   //console.log(response.body[1].human)
//   t.is(response.status, 200, karmaApi.printError(response))
//   t.is(response.body, -2)
// })
//
// test('isPresent', async t => {
//   const response = await t.context.exampleQuery([
//     "isPresent", [
//       "key", {
//         "name": "notFoo",
//         "value": [
//           "map", {
//             "foo": ["string", "bar"]
//           }
//         ]
//       }
//     ]
//   ])
//   t.is(response.status, 200, karmaApi.printError(response))
//   t.is(response.body, false)
// })
//
// test('matchRegex', async t => {
//   const regex = "^(?:(http[s]?|ftp[s])://)?([^:/\\s]+)(:[0-9]+)?((?:/\\w+)*/)([\\w\\-\\.]+[^#?\\s]+)([^#\\s]*)?(#[\\w\\-]+)?$"
//   let response = await t.context.exampleQuery([
//     "matchRegex", {
//       "value": ["string", `https://www.google.com:80/dir/1/2/search.html?arg=0-a&arg1=1-b&arg3-c#hash`],
//       "regex": regex,
//       "caseInsensitive": true,
//       "multiLine": false,
//     }
//   ])
//   t.is(response.status, 200, karmaApi.printError(response))
//   t.is(response.body, true)
//
//   const severeMistake = ':'
//   response = await t.context.exampleQuery([
//     "matchRegex", {
//       "value": ["string", `https://www.google${severeMistake}com:80/dir/1/2/search.html?arg=0-a&arg1=1-b&arg3-c#hash`],
//       "regex": regex,
//       "caseInsensitive": true,
//       "multiLine": false,
//     }
//   ])
//   t.is(response.status, 200, karmaApi.printError(response))
//   t.is(response.body, false)
// })
//
// test('if', async t => {
//   const response = await t.context.exampleQuery([
//     "if", {
//       "condition": [
//         "greater", [
//           ["float", 2.2], ["float", 2.1]
//         ]
//       ],
//       "then": [
//         "add", [["int32", 2], ["int32", 4]]
//       ],
//       "else": [
//         "subtract", [["int32", 2], ["int32", 4]]
//       ]
//     }
//   ])
//   t.is(response.status, 200, karmaApi.printError(response))
//   t.is(response.body, 6)
// })
//
// test('arg', async t => {
//   const response = await karmaApi.tQuery(t,
//     [
//       "mapList",
//       {
//         "value": [
//           "all", ["tag", ["string", "_tag"]]
//         ],
//         "expression": [
//           "field",
//           {
//             "name": "tag",
//             "value": ["arg", {}]
//           }
//         ],
//       }
//     ]
//   )
//   t.is(response.status, 200, karmaApi.printError(response))
//   t.truthy(response.body.find(item => item === "_tag"))
//   t.truthy(response.body.find(item => item === "_model"))
//   t.truthy(response.body.find(item => item === "_user"))
//   t.truthy(response.body.find(item => item === "_role"))
//   t.truthy(response.body.find(item => item === "_expression"))
//   t.truthy(response.body.find(item => item === "_migration"))
// })
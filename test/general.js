import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')
const m = require('./tools/_model.js')
const e = require('./tools/_expressions.js')
const d = require('./tools/_data.js')

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const karmaApi = new KarmaApi(KARMA_ENDPOINT)


test.before(async t => {
  await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
  await karmaApi.instanceAdministratorRequest('admin/reset')
  await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
})


test('all', async t => {
  const response = await karmaApi.tQuery(t, 'all_0',
    e.all(e.tag(d.data(d.string("_tag")))))
  t.is(response.status, 200)
})

test('after', async t => {
  const response = await karmaApi.tQuery(t, 'after_0',
    e.after([
      d.data(d.dateTime("2018-01-01T00:00:00Z")),
      d.data(d.dateTime("2017-01-01T00:00:00Z"))
    ])
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('before', async t => {
  const response = await karmaApi.tQuery(t, 'before_0',
    e.before([
      d.data(d.dateTime("2017-01-01T00:00:00Z")),
      d.data(d.dateTime("2018-01-01T00:00:00Z"))
    ])
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('length', async t => {
  const response = await karmaApi.tQuery(t, 'length_0',
    e.length(d.data(d.list([
        d.int8(1),
        d.int8(2),
        d.int8(3),
        d.int8(4),
        d.int8(5)
      ]
    ))))
  t.is(response.status, 200)
  t.is(response.body, 5)
})

// test('greater', async t => {
//   const response = await karmaApi.tQuery(t, 'greater_0',
//     e.greater(
//       [
//         d.float(2.2), d.float(2.1)
//       ]
//     )
//   )
//   console.log(response.body.humanReadableError.human)
//   t.is(response.status, 200)
//   t.is(response.body, true)
// })
//
// test('less', async t => {
//   const response = await karmaApi.tQuery(t, 'less_0',
//     e.less(
//       [d.int8(1), d.int8(2)]
//     )
//   )
//   t.is(response.status, 200)
//   t.is(response.body, true)
// })

test('equal', async t => {
  let response = await karmaApi.tQuery(t, 'equal_0',
    e.equal(d.string("foo"), d.string("foo"))
  )
  //console.log(response.body.humanReadableError.human)
  t.is(response.status, 200)
  t.is(response.body, true)

  response = await karmaApi.tQuery(t, '',
    e.equal(d.int16("123"), d.string("foo"))
  )
  t.is(response.status, 200)
  t.is(response.body, false)
})

test('and', async t => {
  const response = await karmaApi.tQuery(t, 'and_0',
    e.and(
      e.equal(d.string("foo"), d.string("foo")),
      d.bool(true)
    )
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('or', async t => {
  const response = await karmaApi.tQuery(t, 'or_0',
    e.or(
      e.equal(d.string("foo"), d.string("foo")),
      d.bool(true)
    )
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('field', async t => {
  const response = await karmaApi.tQuery(t, 'field_0',
    e.field(
      "foo",
      d.data(d.struct({
        "foo": d.string("bar")
      }))
    )
  )
  t.is(response.status, 200)
  t.is(response.body, 'bar')
})

test('key', async t => {
  // TODO why we need d.string("foo")?
  const response = await karmaApi.tQuery(t, 'key_0',
    e.key(
      d.string("foo"),
      d.data(d.map({
        "foo": d.string("bar")
      }))
    )
  )
  //console.log(response.body.humanReadableError.human)
  t.is(response.status, 200)
  t.is(response.body, 'bar')
})

test('not', async t => {
  const response = await karmaApi.tQuery(t, 'not_0',
    e.not(
      d.bool(false)
    )
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('addInt8', async t => {
  const response = await karmaApi.tQuery(t, 'addInt8_0',
    e.addInt8(d.int8(2), d.int8(4))
  )
  //console.log(response.body.humanReadableError.human)
  t.is(response.status, 200)
  t.is(response.body, 6)
})

test('subInt8', async t => {
  const response = await karmaApi.tQuery(t, 'subInt8',
    e.subInt8(d.int8(2), d.int8(4))
  )
  t.is(response.status, 200)
  t.is(response.body, -2)
})

test('mulInt8', async t => {
  const response = await karmaApi.tQuery(t, 'mulInt8_0',
    e.mulInt8(d.int8(2), d.int8(4))
  )
  t.is(response.status, 200)
  t.is(response.body, 8)
  //console.log(response.body.humanReadableError.human)
})

test('divInt8', async t => {
  const response = await karmaApi.tQuery(t, 'divInt8_0',
    e.divInt8(d.int8(4), d.int8(2))
  )
  t.is(response.status, 200)
  t.is(response.body, 2)
})

test('assertPresent', async t => {
  // let response = await karmaApi.tQuery(t, 'assertPresent_0',
  //   e.assertPresent(
  //     d.string("notFoo"),
  //     m.map({
  //       "foo": d.string("bar")
  //     })
  //   )
  // )
  // t.is(response.status, 400)
  // expect(response.body).to.have.own.property('humanReadableError')

  let response = await karmaApi.tQuery(t, 'assertPresent_1',
    e.assertPresent(
      d.string("foo"),
      d.data(d.map({
        "foo": d.string("bar")
      }))
    )
  )
  //console.log(response.body.humanReadableError.human)
  t.is(response.status, 200)
  t.is(response.body, "bar")
})

// test('assertCase', async t => {
//   let response = await karmaApi.tQuery(t, [
//     "assertCase", {
//       "case": "foo",
//       "value": [
//         "union", [
//           "bar", ["int8", 4]
//         ]
//       ]
//     }
//   ])
//   t.is(response.status, 400)
//   expect(response.body[1]).to.have.own.property('human')
//
//   response = await karmaApi.tQuery(t, [
//     "assertCase", {
//       "case": "foo",
//       "value": [
//         "union", [
//           "foo", ["int8", 4]
//         ]
//       ]
//     }
//   ])
//   t.is(response.status, 200)
//   t.is(response.body, 4)
// })
//
// test('with', async t => {
//   const response = await karmaApi.tQuery(t, [
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
//   t.is(response.status, 200)
//   t.is(response.body, -2)
// })
//
// test('isPresent', async t => {
//   const response = await karmaApi.tQuery(t, [
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
//   t.is(response.status, 200)
//   t.is(response.body, false)
// })
//
// test('matchRegex', async t => {
//   const regex = "^(?:(http[s]?|ftp[s])://)?([^:/\\s]+)(:[0-9]+)?((?:/\\w+)*/)([\\w\\-\\.]+[^#?\\s]+)([^#\\s]*)?(#[\\w\\-]+)?$"
//   let response = await karmaApi.tQuery(t, [
//     "matchRegex", {
//       "value": ["string", `https://www.google.com:80/dir/1/2/search.html?arg=0-a&arg1=1-b&arg3-c#hash`],
//       "regex": regex,
//       "caseInsensitive": true,
//       "multiLine": false,
//     }
//   ])
//   t.is(response.status, 200)
//   t.is(response.body, true)
//
//   const severeMistake = ':'
//   response = await karmaApi.tQuery(t, [
//     "matchRegex", {
//       "value": ["string", `https://www.google${severeMistake}com:80/dir/1/2/search.html?arg=0-a&arg1=1-b&arg3-c#hash`],
//       "regex": regex,
//       "caseInsensitive": true,
//       "multiLine": false,
//     }
//   ])
//   t.is(response.status, 200)
//   t.is(response.body, false)
// })
//
// test('if', async t => {
//   const response = await karmaApi.tQuery(t, [
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
//   t.is(response.status, 200)
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
//   t.is(response.status, 200)
//   t.truthy(response.body.find(item => item === "_tag"))
//   t.truthy(response.body.find(item => item === "_model"))
//   t.truthy(response.body.find(item => item === "_user"))
//   t.truthy(response.body.find(item => item === "_role"))
//   t.truthy(response.body.find(item => item === "_expression"))
//   t.truthy(response.body.find(item => item === "_migration"))
// })
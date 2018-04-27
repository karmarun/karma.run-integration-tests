import 'dotenv/config'
import test from 'ava'

import * as m from './tools/_model'
import * as e from './tools/_expressions'
import * as f from './tools/_function'
import * as d from './tools/_data'

import { createBeforeTestFn, createAPI } from './tools/_testHelper'

const karmaApi = createAPI()
test.before(createBeforeTestFn(karmaApi))

// mapList
// =======

test('mapList', async t => {
  const response = await karmaApi.tQuery(t, 'mapList_0',
    e.mapList(
      e.all(e.tag(d.string('_tag'))),
      f.karmaFunction(['index', 'value'], e.field('tag', e.scope('value')))
    )
  )

  t.is(response.status, 200, JSON.stringify(response.body))
  t.deepEqual(response.body.sort(), [
    '_expression', '_migration', '_model', '_role', '_tag', '_user'
  ].sort())
})

test('filterList', async t => {
  const query = e.filterList(
    e.all([
      "list",
      [["int8", 5], ["int8", 10], ["int8", 15]]
    ]),
    e.greater(e.arg(), v.int8(8))
  )

  const response = await karmaApi.tQuery(t, '', query)
  // console.log(response.body[1].human)
  t.is(response.status, 200, JSON.stringify(response.body))
  t.deepEqual(response.body.sort(), [10, 15])
})

// test('reduceList', async t => {
//   const response = await karmaApi.tQuery(t, [
//     "reduceList", {
//       "value": [
//         "list",
//         [["int8", 5], ["int8", 10], ["int8", 15]]
//       ],
//       "expression": [
//         "add", [
//           [
//             "index", {
//             "number": 0,
//             "value": {
//               "arg": {}
//             }
//           }
//           ],
//           [
//             "index", {
//             "number": 1,
//             "value": {
//               "arg": {}
//             }
//           }
//           ]
//         ]
//       ]
//     }
//   ])
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.is(response.body, 10)
//   console.log(response.body[1].human)
// })

test('length', async t => {
  const response = await karmaApi.tQuery(t, [
    "length", [
      "all", [
        "tag", ["string", "_tag"]
      ]
    ]
  ])
  t.is(response.status, 200, JSON.stringify(response.body))
  t.deepEqual(response.body, 6)
})

test('first', async t => {
  const response = await karmaApi.tQuery(t, [
    "first", [
      "all", [
        "tag", ["string", "_tag"]
      ]
    ]
  ])
  t.is(response.status, 200, JSON.stringify(response.body))
  t.truthy(response.body)
})

test('inList', async t => {
  let response = await karmaApi.tQuery(t, [
    "inList", {
      "in": [
        "list",
        [["string", "foo"], ["int8", 10], ["int8", 15]]
      ],
      "value": ["string", "foo"]
    }
  ])
  t.is(response.status, 200, JSON.stringify(response.body))
  t.true(response.body)

  response = await karmaApi.tQuery(t, [
    "inList", {
      "in": [
        "list",
        [["string", "foo"], ["int8", 10], ["int8", 15]]
      ],
      "value": ["string", "bar"]
    }
  ])
  t.is(response.status, 200, JSON.stringify(response.body))
  t.false(response.body)
})

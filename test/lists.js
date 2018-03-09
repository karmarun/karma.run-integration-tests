import test from 'ava'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')
const m = require('./tools/_model.js')
const e = require('./tools/_expressions.js')
const v = require('./tools/_value.js')

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const karmaApi = new KarmaApi(KARMA_ENDPOINT)

//**********************************************************************************************************************
// Init Tests
//**********************************************************************************************************************

test.before(async t => {
  await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
  await karmaApi.instanceAdministratorRequest('admin/reset')
  await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
})


//**********************************************************************************************************************
// Start Tests
//**********************************************************************************************************************

test('mapList', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "mapList",
      {
        "value": [
          "all", [
            "tag", [
              "string", "_tag"]
          ]
        ],
        "expression": [
          "field", {
            "name": "tag",
            "value": [
              "arg", {}
            ]
          }
        ]
      }
    ]
  )
  t.is(response.status, 200, JSON.stringify(response.body))
  t.deepEqual(response.body.sort(), ['_expression', '_migration', '_model', '_role', '_tag', '_user'].sort())
})

test('filterList', async t => {
  const query = e.filterList(
    e.all([
      "list",
      [["int8", 5], ["int8", 10], ["int8", 15]]
    ]),
    e.greater(e.arg(), v.int8(8))
  )
  const response = await karmaApi.tQuery(t, query)
  console.log(response.body[1].human)
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

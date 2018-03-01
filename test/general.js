import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

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
  const response = await karmaApi.tQuery(t,
    [
      "all", ["tag", ["string", "_tag"]]
    ])
  t.is(response.status, 200)
})

test('metarialize', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "metarialize",
      [
        "first",
        [
          "all", ["tag", ["string", "_tag"]]
        ]
      ]
    ])
  t.is(response.status, 200)
  t.truthy(response.body.created)
  t.truthy(response.body.updated)
  t.truthy(response.body.id)
  t.truthy(response.body.model)
  t.truthy(response.body.value)
})

test('after', async t => {
  const response = await karmaApi.tQuery(t, [
    "after", [
      [
        "dateTime", "2018-01-01T00:00:00Z"
      ],
      [
        "dateTime", "2017-01-01T00:00:00Z"
      ]
    ]
  ])
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('before', async t => {
  const response = await karmaApi.tQuery(t, [
    "before", [
      [
        "dateTime", "2017-01-01T00:00:00Z"
      ],
      [
        "dateTime", "2018-01-01T00:00:00Z"
      ]
    ]
  ])
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('length', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "length",
      ["list", [["int8", 1], ["int8", 2], ["int8", 3], ["int8", 4], ["int8", 5]]]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, 5)
})

test('greater', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "greater",
      [["float", 2.2], ["float", 2.1]]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('less', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "less",
      [["int8", 1], ["int8", 2]]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('equal', async t => {
  let response = await karmaApi.tQuery(t,
    [
      "equal",
      [["string", "foo"], ["string", "foo"]]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, true)

  response = await karmaApi.tQuery(t,
    [
      "equal",
      [["int16", 123], ["string", "foo"]]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, false)
})

test('and', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "and",
      [
        ["equal",
          [["string", "foo"], ["string", "foo"]]
        ],
        ["bool", true]
      ]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('or', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "or",
      [
        ["equal",
          [["string", "foo"], ["string", "foo"]]
        ],
        ["bool", true]
      ]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('field', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "field",
      {
        "name": "foo",
        "value": ["struct", {
          "foo": ["string", "bar"]
        }]
      }
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, 'bar')
})

test('key', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "key",
      {
        "name": "foo",
        "value": ["map", {
          "foo": ["string", "bar"]
        }]
      }
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, 'bar')
})

test('not', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "not", ["bool", false]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('add', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "add",
      [["int8", 2], ["int8", 4]]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, 6)
})

test('subtract', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "subtract",
      [["int8", 2], ["int8", 4]]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, -2)
})

test('multiply', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "multiply",
      [["float", 2.2], ["float", 4.0]]
    ])
  t.is(response.status, 200)
  t.is(response.body, 8.8)
})

test('divide', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "divide",
      [["float", 2.0], ["float", -4.0]]
    ]
  )
  t.is(response.status, 200)
  t.is(response.body, -0.5)
})

// test('zero', async t => {
//   const response = await karmaApi.tQuery(t, {
//     "get": {
//       "create": {
//         "in": {
//           "tag": "testModel"
//         },
//         "value": {
//           "zero": {}
//         }
//       }
//     },
//   })
//   t.is(response.status, 200)
//   t.is(response.body.myBool, false)
//   t.is(new Date(response.body.myDateTime).getTime(), new Date('1754-08-30T22:43:41Z').getTime())
//   t.is(response.body.myFloat, 0)
//   t.is(response.body.myInt, 0)
//   t.is(response.body.myString, '')
// })

// test('intToFloat', async t => {
//   const response = await karmaApi.tQuery(t,
//     [
//       "divide",
//       [["float", 2], ["intToFloat", ["int8", -4]]]
//     ]
//   )
//   // console.log(response.body[1].human)
//   t.is(response.status, 200)
//   t.is(response.body, -0.5)
// })

// test('floatToInt', async t => {
//   const response = await karmaApi.tQuery(t,
//     [
//       "add", [["int8", 2], ["floatToInt", ["float", -4]]]
//     ]
//   )
//   t.is(response.status, 200)
//   t.is(response.body, -2)
// })

test('assertPresent', async t => {
  let response = await karmaApi.tQuery(t, [
    "assertPresent", [
      "key", {
        "name": "notFoo",
        "value": [
          "map", {
            "foo": ["string", "bar"]
          }
        ]
      }
    ]
  ])
  t.is(response.status, 400)
  expect(response.body[1]).to.have.own.property('human')

  response = await karmaApi.tQuery(t, [
    "assertPresent", [
      "key", {
        "name": "foo",
        "value": [
          "map", {
            "foo": ["string", "bar"]
          }
        ]
      }
    ]
  ])
  t.is(response.status, 200)
  t.is(response.body, "bar")
})

test('assertCase', async t => {
  let response = await karmaApi.tQuery(t, [
    "assertCase", {
      "case": "foo",
      "value": [
        "union", [
          "bar", ["int8", 4]
        ]
      ]
    }
  ])
  t.is(response.status, 400)
  expect(response.body[1]).to.have.own.property('human')

  response = await karmaApi.tQuery(t, [
    "assertCase", {
      "case": "foo",
      "value": [
        "union", [
          "foo", ["int8", 4]
        ]
      ]
    }
  ])
  t.is(response.status, 200)
  t.is(response.body, 4)
})

test('with', async t => {
  const response = await karmaApi.tQuery(t, [
    "with", {
      "value": [
        "struct", {
          "valA": ["int32", 4],
          "valB": ["int32", -6]
        }
      ],
      "return": [
        "add", [
          [
            "field",
            {
              "name": "valA",
              "value": ["arg", {}]
            }
          ],
          [
            "field",
            {
              "name": "valB",
              "value": ["arg", {}]
            }
          ]
        ]
      ]
    }
  ])
  //console.log(response.body[1].human)
  t.is(response.status, 200)
  t.is(response.body, -2)
})

test('isPresent', async t => {
  const response = await karmaApi.tQuery(t, [
    "isPresent", [
      "key", {
        "name": "notFoo",
        "value": [
          "map", {
            "foo": ["string", "bar"]
          }
        ]
      }
    ]
  ])
  t.is(response.status, 200)
  t.is(response.body, false)
})

test('matchRegex', async t => {
  const regex = "^(?:(http[s]?|ftp[s])://)?([^:/\\s]+)(:[0-9]+)?((?:/\\w+)*/)([\\w\\-\\.]+[^#?\\s]+)([^#\\s]*)?(#[\\w\\-]+)?$"
  let response = await karmaApi.tQuery(t, [
    "matchRegex", {
      "value": ["string", `https://www.google.com:80/dir/1/2/search.html?arg=0-a&arg1=1-b&arg3-c#hash`],
      "regex": regex,
      "caseInsensitive": true,
      "multiLine": false,
    }
  ])
  t.is(response.status, 200)
  t.is(response.body, true)

  const severeMistake = ':'
  response = await karmaApi.tQuery(t, [
    "matchRegex", {
      "value": ["string", `https://www.google${severeMistake}com:80/dir/1/2/search.html?arg=0-a&arg1=1-b&arg3-c#hash`],
      "regex": regex,
      "caseInsensitive": true,
      "multiLine": false,
    }
  ])
  t.is(response.status, 200)
  t.is(response.body, false)
})

test('if', async t => {
  const response = await karmaApi.tQuery(t, [
    "if", {
      "condition": [
        "greater", [
          ["float", 2.2], ["float", 2.1]
        ]
      ],
      "then": [
        "add", [["int32", 2], ["int32", 4]]
      ],
      "else": [
        "subtract", [["int32", 2], ["int32", 4]]
      ]
    }
  ])
  t.is(response.status, 200)
  t.is(response.body, 6)
})

test('arg', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "mapList",
      {
        "value": [
          "all", ["tag", ["string", "_tag"]]
        ],
        "expression": [
          "field",
          {
            "name": "tag",
            "value": ["arg", {}]
          }
        ],
      }
    ]
  )
  t.is(response.status, 200)
  t.truthy(response.body.find(item => item === "_tag"))
  t.truthy(response.body.find(item => item === "_model"))
  t.truthy(response.body.find(item => item === "_user"))
  t.truthy(response.body.find(item => item === "_role"))
  t.truthy(response.body.find(item => item === "_expression"))
  t.truthy(response.body.find(item => item === "_migration"))
})
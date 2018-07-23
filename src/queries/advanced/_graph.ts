// import { data as d, expression as e, KarmaError, KarmaErrorType } from '@karma.run/sdk'
// import test from './_before'

// //**********************************************************************************************************************
// // Start Tests
// //**********************************************************************************************************************

// test.serial('resolveRefs', async t => {
//   let response = await karmaApi.tQuery(t, [
//     "resolveRefs", {
//       "value": [
//         "first", [
//           "all", [
//             "tag", ["string", "_user"]
//           ]
//         ]
//       ],
//       "models": [
//         [
//           "tag", ["string", "_role"]
//         ]
//       ]
//     }
//   ])

//   t.is(response.status, 200, JSON.stringify(response.body))
//   console.log(response.body[1].human)
//   // t.truthy(response.body)
//   // t.is(response.body.name, 'modelA')
//   // t.truthy(response.body.refB)
//   // const refB = response.body.refB
//   // t.regex(refB.listC[0], recordIdRegex)
//   // t.deepEqual(refB.mapH, {"mapKey": {"name": "modelH"}})
//   // t.is(refB.name, 'modelB')
//   // t.regex(refB.optionalG, recordIdRegex)
//   // t.deepEqual(refB.setD, [{"name": "modelD"}])
//   // t.deepEqual(refB.tupleI, [{"name": "modelI"}, "test"])
//   // t.deepEqual(refB.unionEF, {"modelE": {"name": "modelE"}})
// })

// test.serial('resolveAllRefs', async t => {
//   let response = await karmaApi.tQuery(t, [
//     "resolveAllRefs", [
//       "resolveAllRefs", [
//         "first", [
//           "all", [
//             "tag", ["string", "_user"]
//           ]
//         ]
//       ]
//     ]
//   ])
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.deepEqual(response.body,
//     {
//       "password": "",
//       "roles": [
//         {
//           "name": "admins",
//           "permissions": {
//             "create": [
//               "bool",
//               true
//             ],
//             "delete": [
//               "bool",
//               true
//             ],
//             "read": [
//               "bool",
//               true
//             ],
//             "update": [
//               "bool",
//               true
//             ]
//           }
//         }
//       ],
//       "username": "admin"
//     }
//   )
// })

// test.serial('graphFlow', async t => {
//   const response = await karmaApi.tQuery(t,
//     [
//       "graphFlow",
//       {
//         "start": [
//           "refTo", [
//             "first", [
//               "all", [
//                 "tag", ["string", "_role"]
//               ]
//             ]
//           ]
//         ],
//         "flow": [
//           {
//             "from": [
//               "tag", ["string", "_role"]
//             ],
//             "backward": [
//               [
//                 "tag", ["string", "_user"]
//               ]
//             ],
//             "forward": [
//               [
//                 "tag", ["string", "_expression"]
//               ]
//             ]
//           }
//         ]
//       }
//     ])
//   console.log(response.body[1].human)
//   // const check = Object.entries(response.body).reduce((pref, model) => {
//   //   const [modelId, resultList] = model
//   //   t.regex(modelId, recordIdRegex)
//   //
//   //   return Object.entries(resultList).reduce((_pref, entry) => {
//   //     const [recordId, resultObject] = entry
//   //     t.regex(recordId, recordIdRegex)
//   //     _pref[resultObject.name] = true
//   //     return _pref
//   //   }, pref)
//   // }, {})
//   // t.deepEqual(check, {
//   //     modelA: true,
//   //     modelB: true,
//   //     modelC1: true,
//   //     modelC2: true,
//   //     modelC3: true,
//   //     modelD: true,
//   //     modelE: true,
//   //     modelG: true,
//   //     modelH: true,
//   //     modelI: true,
//   //   }
//   // )
// })

// test.serial('referrers', async t => {
//   let response = await karmaApi.tQuery(t,
//     [
//       "referrers",
//       {
//         "of": [
//           "refTo", [
//             "first", [
//               "all", [
//                 "tag", ["string", "_role"]
//               ]
//             ]
//           ]
//         ],
//         "in": [
//           "tag", ["string", "_user"]
//         ]
//       }
//     ]
//   )
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.regex(response.body[0][0], recordIdRegex)
//   t.regex(response.body[0][1], recordIdRegex)
// })

// test.serial('referred', async t => {
//   let response = await karmaApi.tQuery(t,
//     [
//       "referred",
//       {
//         "from": [
//           "refTo", [
//             "first", [
//               "all", [
//                 "tag", ["string", "_user"]
//               ]
//             ]
//           ]
//         ],
//         "in": [
//           "tag", ["string", "_role"]
//         ]
//       }
//     ]
//   )
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.regex(response.body[0][0], recordIdRegex)
//   t.regex(response.body[0][1], recordIdRegex)
// })

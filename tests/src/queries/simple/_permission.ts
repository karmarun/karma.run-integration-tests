// import { data as d, expression as e, KarmaError, KarmaErrorType } from 'karma.run'
// import test from './_before'

// //**********************************************************************************************************************
// // Init Tests
// //**********************************************************************************************************************

// test.before(async t => {
//   await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
//   await karmaApi.instanceAdministratorRequest('admin/reset')
//   await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)

//   const createModel = [
//     "create", {
//       "in": [
//         "tag", ["string", "_tag"]
//       ],
//       "value": [
//         "struct",
//         {
//           "tag": ["string", "modelA"],
//           "model": [
//             "create",
//             {
//               "in": [
//                 "tag",
//                 [
//                   "string",
//                   "_model"
//                 ]
//               ],
//               "value": [
//                 "union",
//                 [
//                   "struct",
//                   [
//                     "map",
//                     {
//                       "text": [
//                         "union",
//                         [
//                           "string",
//                           [
//                             "struct",
//                             {}
//                           ]
//                         ]
//                       ],
//                       "owner": [
//                         "union",
//                         [
//                           "ref",
//                           [
//                             "tag",
//                             [
//                               "string",
//                               "_role"
//                             ]
//                           ]
//                         ]
//                       ]
//                     }
//                   ]
//                 ]
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]

//   const response = await karmaApi.tQuery(t, createModel)
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.regex(response.body[0], recordIdRegex)
//   t.regex(response.body[1], recordIdRegex)

//   //console.log(response.body[1].human)
//   // t.is(response.status, 200, JSON.stringify(response.body))
//   // t.regex(response.body[0], recordIdRegex)
//   // t.regex(response.body[1], recordIdRegex)

//   const expression = await karmaApi.create(t, "_expression", [
//     "switchModelRef", {
//       "default": ["bool", false],
//       "cases": [
//         {
//           "match": [
//             "tag", ["string", "_role"]
//           ],
//           "return": ["bool", true]
//         },
//         // {
//         //   "match": {
//         //     "tag": "modelA"
//         //   },
//         //   "return": {
//         //     "equal": [
//         //       {
//         //         "field": "refRole"
//         //       },
//         //       {
//         //         "first": {
//         //           "referred": {
//         //             "from": {
//         //               "currentUser": {}
//         //             },
//         //             "in": {
//         //               "tag": "_role"
//         //             }
//         //           }
//         //         }
//         //       }
//         //     ]
//         //   }
//         // },
//         // {
//         //   "match": {
//         //     "tag": "modelB"
//         //   },
//         //   "return": {
//         //     "equal": [
//         //       {
//         //         "field": "name"
//         //       },
//         //       "modelB1"
//         //     ]
//         //   }
//         // },
//         // {
//         //   "match": {
//         //     "tag": "modelC"
//         //   },
//         //   "return": {
//         //     "greater": [
//         //       {
//         //         "length": {
//         //           "referrers": {
//         //             "of": {
//         //               "refTo": {
//         //                 "id": {}
//         //               }
//         //             },
//         //             "in": {
//         //               "tag": "modelB"
//         //             }
//         //           }
//         //         }
//         //       },
//         //       0
//         //     ]
//         //   }
//         // }
//       ]
//     }
//   ])

//   console.log(expression.body[1].human)

//   // const roleA = await karmaApi.create(t, '_role', {
//   //   "name": "roleA",
//   //   "permissions": {
//   //     "create": expression,
//   //     "delete": expression,
//   //     "read": expression,
//   //     "update": expression
//   //   }
//   // })
//   // const userA = await karmaApi.create(t, '_user', {
//   //   "password": "$2a$04$I/wYipwpWzai1f/7orFrFOudssqCr7/itDcaczlwmTtaCtkeb8QS6",
//   //   "roles": [
//   //     roleA
//   //   ],
//   //   "username": "userA"
//   // })
//   //
//   // const modelC1 = await karmaApi.create(t, 'modelC', {
//   //   "name": "modelC1"
//   // })
//   // const modelC2 = await karmaApi.create(t, 'modelC', {
//   //   "name": "modelC2"
//   // })
//   // const modelB1 = await karmaApi.create(t, 'modelB', {
//   //   "name": "modelB1",
//   //   "refC": modelC1
//   // })
//   // const modelB2 = await karmaApi.create(t, 'modelB', {
//   //   "name": "modelB2",
//   //   "refC": modelC2
//   // })
//   // const modelA1 = await karmaApi.create(t, 'modelA', {
//   //   "name": "modelA1",
//   //   "refB": modelB1,
//   //   "refRole": roleA
//   // })
//   // const modelA2 = await karmaApi.create(t, 'modelA', {
//   //   "name": "modelA2",
//   //   "refB": modelB2
//   // })
// })


// // //**********************************************************************************************************************
// // // Start Tests
// // //**********************************************************************************************************************
// //
// test.serial('login with userA', async t => {
//   const signature = await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
//   //t.regex(signature, /.{50,200}/)
//   t.true(true)
// })
// //
// // test('get all modelA records', async t => {
// //   const response = await karmaApi.tQuery(t, {
// //     "all": {
// //       "tag": "modelA"
// //     }
// //   })
// //   t.is(response.status, 200, JSON.stringify(response.body))
// //   t.truthy(response.body[0])
// //   t.falsy(response.body[1])
// //   t.is(response.body[0].name, 'modelA1')
// //   t.regex(response.body[0].refB, recordIdRegex)
// //   t.regex(response.body[0].refRole, recordIdRegex)
// // })
// //
// // test('get all modelB records', async t => {
// //   const response = await karmaApi.tQuery(t, {
// //     "all": {
// //       "tag": "modelB"
// //     }
// //   })
// //   t.is(response.status, 200, JSON.stringify(response.body))
// //   t.truthy(response.body[0])
// //   t.falsy(response.body[1])
// //   t.is(response.body[0].name, 'modelB1')
// //   t.regex(response.body[0].refC, recordIdRegex)
// // })
// //
// // test('get all modelC records', async t => {
// //   const response = await karmaApi.tQuery(t, {
// //     "all": {
// //       "tag": "modelC"
// //     }
// //   })
// //   t.is(response.status, 200, JSON.stringify(response.body))
// //   t.truthy(response.body[0])
// //   t.falsy(response.body[1])
// //   t.is(response.body[0].name, 'modelC1')
// // })
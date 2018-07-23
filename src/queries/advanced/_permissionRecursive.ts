// import { data as d, expression as e, KarmaError, KarmaErrorType } from '@karma.run/sdk'
// import test from './_before'

// //**********************************************************************************************************************
// // Init Tests
// //**********************************************************************************************************************

// test.before(async t => {
//   await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
//   await karmaApi.instanceAdministratorRequest('admin/reset')
//   await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
//   //
//   // const tags = await karmaApi.getTags()
//   // const result = await karmaApi.tQuery(t, {
//   //   "do": {
//   //     "createModels": {
//   //       "createMultiple": {
//   //         "in": {
//   //           "tag": "_model"
//   //         },
//   //         "values": {
//   //           "modelA": {
//   //             "contextual": {
//   //               "struct": {
//   //                 "name": {
//   //                   "string": {}
//   //                 }
//   //               }
//   //             }
//   //           },
//   //           "modelB": {
//   //             "contextual": {
//   //               "struct": {
//   //                 "name": {
//   //                   "string": {}
//   //                 }
//   //               }
//   //             }
//   //           }
//   //         }
//   //       }
//   //     },
//   //     "createTag": {
//   //       "create": {
//   //         "in": {
//   //           "tag": "_tag"
//   //         },
//   //         "value": {
//   //           "newStruct": {
//   //             "tag": {
//   //               "field": {
//   //                 "name": "key",
//   //                 "value": {
//   //                   "id": {}
//   //                 }
//   //               }
//   //             },
//   //             "model": {
//   //               "field": {
//   //                 "name": "value",
//   //                 "value": {
//   //                   "id": {}
//   //                 }
//   //               }
//   //             }
//   //           }
//   //         }
//   //       }
//   //     },
//   //     "return": {
//   //       "mapMap": {
//   //         "value": {
//   //           "bind": "createModels"
//   //         },
//   //         "expression": {
//   //           "bind": "createTag"
//   //         }
//   //       }
//   //     }
//   //   }
//   // })
//   //
//   // const expressionRoleA = await karmaApi.create(t, "_expression", {
//   //   "switchModelRef": {
//   //     "default": false,
//   //     "cases": [
//   //       {
//   //         "match": {
//   //           "tag": "modelA"
//   //         },
//   //         "return": {
//   //           "equal": [
//   //             {
//   //               "length": {
//   //                 "all": {
//   //                   "tag": "modelB"
//   //                 }
//   //               }
//   //             },
//   //             0
//   //           ]
//   //         }
//   //       },
//   //       {
//   //         "match": {
//   //           "tag": "modelB"
//   //         },
//   //         "return": {
//   //           "equal": [
//   //             {
//   //               "length": {
//   //                 "all": {
//   //                   "tag": "modelA"
//   //                 }
//   //               }
//   //             },
//   //             0
//   //           ]
//   //         }
//   //       }
//   //     ]
//   //   }
//   // })
//   // const expressionRoleB = await karmaApi.create(t, "_expression", {
//   //   "switchModelRef": {
//   //     "default": false,
//   //     "cases": [
//   //       {
//   //         "match": {
//   //           "tag": "modelA"
//   //         },
//   //         "return": {
//   //           "equal": [
//   //             {
//   //               "length": {
//   //                 "all": {
//   //                   "tag": "modelB"
//   //                 }
//   //               }
//   //             },
//   //             0
//   //           ]
//   //         }
//   //       },
//   //       {
//   //         "match": {
//   //           "tag": "modelB"
//   //         },
//   //         "return": true
//   //       }
//   //     ]
//   //   }
//   // })
//   // const roleA = await karmaApi.create(t, '_role', {
//   //   "name": "roleA",
//   //   "permissions": {
//   //     "create": expressionRoleA,
//   //     "delete": expressionRoleA,
//   //     "read": expressionRoleA,
//   //     "update": expressionRoleA
//   //   }
//   // })
//   // await karmaApi.create(t, '_user', {
//   //   "password": "$2a$04$I/wYipwpWzai1f/7orFrFOudssqCr7/itDcaczlwmTtaCtkeb8QS6",
//   //   "roles": [
//   //     roleA
//   //   ],
//   //   "username": "userA"
//   // })
//   // const roleB = await karmaApi.create(t, '_role', {
//   //   "name": "roleB",
//   //   "permissions": {
//   //     "create": expressionRoleB,
//   //     "delete": expressionRoleB,
//   //     "read": expressionRoleB,
//   //     "update": expressionRoleB
//   //   }
//   // })
//   // await karmaApi.create(t, '_user', {
//   //   "password": "$2a$04$I/wYipwpWzai1f/7orFrFOudssqCr7/itDcaczlwmTtaCtkeb8QS6",
//   //   "roles": [
//   //     roleB
//   //   ],
//   //   "username": "userB"
//   // })
//   //
//   // await karmaApi.create(t, 'modelA', {
//   //   "name": "modelA1"
//   // })
//   //
//   // await karmaApi.create(t, 'modelB', {
//   //   "name": "modelB1"
//   // })
// })
// //
// // test.after(async t => {
// //   const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
// //   t.is(response.status, 200, JSON.stringify(response.body))
// // })
// //
// //
// // //**********************************************************************************************************************
// // // Start Tests
// // //**********************************************************************************************************************
// //
// // test.serial('login with userA', async t => {
// //   const signature = await karmaApi.signIn(DB_NAME, 'userA', 'asdf')
// //   t.regex(signature, /.{50,200}/)
// // })
// //
// // test.serial('get all modelA records', async t => {
// //   const response = await karmaApi.tQuery(t, {
// //     "all": {
// //       "tag": "modelA"
// //     }
// //   })
// //   t.is(response.status, 200, JSON.stringify(response.body))
// //   t.truthy(response.body[0])
// //   t.is(response.body[0].name, 'modelA1')
// // })
// //
// // test.serial('login with userB', async t => {
// //   const signature = await karmaApi.signIn(DB_NAME, 'userB', 'asdf')
// //   t.regex(signature, /.{50,200}/)
// // })
// //
// // test.serial('get all modelA records', async t => {
// //   const response = await karmaApi.tQuery(t, {
// //     "all": {
// //       "tag": "modelA"
// //     }
// //   })
// //   t.is(response.status, 200, JSON.stringify(response.body))
// //   t.falsy(response.body[0])
// // })
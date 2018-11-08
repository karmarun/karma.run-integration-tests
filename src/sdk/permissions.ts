import { isRef } from '@karma.run/sdk'
import test from './_before'
import { xpr as e, val as d, mod as m, tpt } from 'karma-sdk-typescript'

import { KARMA_ENDPOINT } from '../helpers/_environment'

test.serial('create roles and permissions', async t => {

  const modelRef = await createTestModel(t)
  t.true(isRef(modelRef))

  const expressionRef = await createExpression(t)
  t.true(isRef(expressionRef))

  // const refRoleA = await createRoleAndUser(t, expressionRef, 'GroupA')
  // t.true(isRef(refRoleA))
  //
  // const refRoleB = await createRoleAndUser(t, expressionRef, 'GroupB')
  // t.true(isRef(refRoleB))
  //
  // let response = await t.context.exampleQuery(undefined,
  //   create('modelA', d.struct({
  //     text: d.string('recordGroupA'),
  //     owner: d.ref(refRoleA)
  //   }))
  // )
  // t.true(isRef(response))
  //
  // response = await t.context.exampleQuery(undefined,
  //   create('modelA', d.struct({
  //     text: d.string('recordGroupB'),
  //     owner: d.ref(refRoleB)
  //   }))
  // )
  // t.true(isRef(response))
})

//
// //**********************************************************************************************************************
// // check permissions with different users
// //**********************************************************************************************************************
// let client: Client
//
// test.serial('check userA', async t => {
//   client = new Client(KARMA_ENDPOINT)
//   const signature = await client.authenticate('GroupA', 'asdf')
//   t.truthy(signature)
//
//   const response = await client.query(
//     f.function([],
//       e.all(e.tag('modelA'))
//     )
//   )
//   t.is(response[0].text, 'recordGroupA')
//   t.is(response.length, 1)
// })
//
// test.serial('check userB', async t => {
//   client = new Client(KARMA_ENDPOINT)
//   const signature = await client.authenticate('GroupB', 'asdf')
//   t.truthy(signature)
//
//   const response = await client.query(
//     f.function([],
//       e.all(e.tag('modelA'))
//     )
//   )
//   t.is(response[0].text, 'recordGroupB')
//   t.is(response.length, 1)
// })
//
// //**********************************************************************************************************************
// // Utils
// //**********************************************************************************************************************
//
// function create(tag: string, data: DataExpression): CreateFn {
//   return e.create(
//     e.tag(tag),
//     f.function(['ref'],
//       e.data(data)
//     )
//   )
// }

async function createTestModel(t: any) {
  const metaRef = await t.context.adminSession.getMetaModelRef()
  const dataContext = e.DataContext

  const role = await t.context.exampleQuery(undefined,
    e.tag("_role")
  )

  const model = m.struct({
    text: m.string,
    owner: m.ref(role[1]),
  })

  return await t.context.exampleQuery('create_1',
    e.define('myNewModelA',
      e.create(e.tag('_model'),
        arg => e.data(model.toValue(metaRef.id).toDataConstructor())
      )
    ),
    e.create(e.tag('_tag'),
      arg => e.data(dataContext.struct({
          tag: dataContext.string('modelA'),
          model: dataContext.expr(e.scope('myNewModelA'))
        })
      )
    )
  )
}


async function createExpression(t: any) {
  // const q = e.switchModelRef(value, e.data(d.bool(false)), [
  //   {
  //     match: e.tag('_role'),
  //     return: f.function(['value'], d.bool(true))
  //   },
  //   {
  //     match: e.tag('modelA'),
  //     return: f.function(
  //       ['value'],
  //       e.equal(
  //         e.field('owner', e.scope('value')),
  //         e.first(e.referred(e.currentUser(), e.tag('_role')))
  //       )
  //     )
  //   }
  // ])
  //
  // return await t.context.exampleQuery(undefined, q)
}

// async function createRoleAndUser(t: any, expressionRef: [string, string], group: string) {
//   let query = create('_role',
//     d.struct({
//       name: d.string(group),
//       permissions: d.struct({
//         create: d.ref(expressionRef),
//         delete: d.ref(expressionRef),
//         read: d.ref(expressionRef),
//         update: d.ref(expressionRef)
//       })
//     }))
//   const refRole = await t.context.exampleQuery(undefined, query)
//   t.true(isRef(refRole))
//
//   query = create('_user',
//     d.struct({
//       username: d.string(group),
//       password: d.string('$2a$04$I/wYipwpWzai1f/7orFrFOudssqCr7/itDcaczlwmTtaCtkeb8QS6'),
//       roles: d.list(
//         d.ref(refRole)
//       )
//     })
//   )
//   await t.context.exampleQuery(undefined, query)
//   t.true(isRef(refRole))
//
//   return refRole
// }
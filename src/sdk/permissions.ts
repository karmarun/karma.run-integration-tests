import { isRef } from '@karma.run/sdk'
import test from './_before'
import { xpr as e, val as d, mod as m, tpt } from 'karma-sdk-typescript'

import { KARMA_ENDPOINT } from '../helpers/_environment'

test.serial('create roles and permissions', async t => {

  const modelRef = await createTestModel(t)
  t.true(isRef(modelRef))

  const expressionRef = await createExpression(t)
  t.true(isRef(expressionRef))

  const refRoleA = await createRoleAndUser(t, expressionRef, 'GroupA')
  t.true(isRef(refRoleA))

  const refRoleB = await createRoleAndUser(t, expressionRef, 'GroupB')
  t.true(isRef(refRoleB))

  let response = await t.context.exampleQuery(undefined,
    e.create(
      e.tag('modelA'),
      arg => e.data(
        d.struct({
          text: d.string('recordGroupA'),
          owner: d.ref(...refRoleA)
        }).toDataConstructor()
      )
    )
  )
  t.true(isRef(response))

  response = await t.context.exampleQuery(undefined,
    e.create(
      e.tag('modelA'),
      arg => e.data(
        d.struct({
          text: d.string('recordGroupB'),
          owner: d.ref(...refRoleB)
        }).toDataConstructor()
      )
    )
  )
  t.true(isRef(response))
})


//**********************************************************************************************************************
// check permissions with different users
//**********************************************************************************************************************

test.serial('check userA', async t => {
  let client = new tpt.Remote(KARMA_ENDPOINT)
  let session = await client.login('GroupA', 'asdf')
  t.truthy(session)

  const response = await session.do(
    e.all(e.tag('modelA'))
  )
  t.is(response[0].text, 'recordGroupA')
  t.is(response.length, 1)
})

test.serial('check userB', async t => {
  let client = new tpt.Remote(KARMA_ENDPOINT)
  let session = await client.login('GroupB', 'asdf')
  t.truthy(session)

  const response = await session.do(
    e.all(e.tag('modelA'))
  )
  t.is(response[0].text, 'recordGroupB')
  t.is(response.length, 1)
})

//**********************************************************************************************************************
// Utils
//**********************************************************************************************************************

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

  const expression = e.func(
    param => e.switchModelRef(
      param,
      e.bool(true),
      [
        {
          match: e.tag('_role'),
          return: e.func(value => e.bool(true))
        },
        {
          match: e.tag('modelA'),
          return: e.func(value => e.equal(
            e.field('owner', value),
            e.first(e.referred(e.currentUser(), e.tag('_role')))
          ))
        }
      ]
    )
  )

  const query = e.create(
    e.tag('_expression'),
    arg => e.data(expression.toValue().toDataConstructor())
  )

  return await t.context.exampleQuery(undefined, query)
}

async function createRoleAndUser(t: any, expressionRef: [string, string], group: string) {
  let query = e.create(
    e.tag('_role'),
    arg => e.data(
      d.struct({
        name: d.string(group),
        permissions: d.struct({
          create: d.ref(...expressionRef),
          delete: d.ref(...expressionRef),
          read: d.ref(...expressionRef),
          update: d.ref(...expressionRef)
        })
      }).toDataConstructor()
    )
  )
  const refRole: [string, string] = await t.context.exampleQuery(undefined, query)
  t.true(isRef(refRole))

  query = e.create(
    e.tag('_user'),
    (arg) => e.data(
      d.struct({
        username: d.string(group),
        password: d.string('$2a$04$I/wYipwpWzai1f/7orFrFOudssqCr7/itDcaczlwmTtaCtkeb8QS6'),
        roles: d.list([
          d.ref(...refRole)
        ])
      }).toDataConstructor()
    )
  )
  await t.context.exampleQuery(undefined, query)
  t.true(isRef(refRole))

  return refRole
}
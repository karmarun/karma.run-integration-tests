import {
  Client,
  isRef,
  expression as e,
  data as d,
  func as f,
  model as m,
  CreateFn, DataExpression, createTypedExpression, DefaultTags
} from '@karma.run/sdk'

import {KARMA_ENDPOINT} from '../helpers/_environment'
import test from './_before'

test.serial('create roles and permissions', async t => {

  const modelRef = await createTestModel(t)
  t.true(isRef(modelRef))

  const expressionRef = await createExpression(t)
  t.true(isRef(expressionRef))

  //const expressionRef = d.expr(e.refTo(e.first(e.all(e.tag('_expression')))))

  const refRoleA = await createRoleAndUser(t, expressionRef, 'GroupA')
  t.true(isRef(refRoleA))

  const refRoleB = await createRoleAndUser(t, expressionRef, 'GroupB')
  t.true(isRef(refRoleB))

  let response = await t.context.exampleQuery(undefined,
    create('modelA', d.struct({
      text: d.string('recordGroupA'),
      owner: d.ref(refRoleA)
    }))
  )
  t.true(isRef(response))

  response = await t.context.exampleQuery(undefined,
    create('modelA', d.struct({
      text: d.string('recordGroupB'),
      owner: d.ref(refRoleB)
    }))
  )
  t.true(isRef(response))
})


//**********************************************************************************************************************
// check permissions with different users
//**********************************************************************************************************************
let client: Client

test.skip('check userA', async t => {
  client = new Client(KARMA_ENDPOINT)
  const signature = await client.authenticate('GroupA', 'asdf')
  t.truthy(signature)

  const response = await client.query(
    f.function([],
      e.all(e.tag('modelA'))
    )
  )
  t.is(response[0].text, 'recordGroupA')
  t.is(response.length, 1)
})


//**********************************************************************************************************************
// Utils
//**********************************************************************************************************************

function create(tag: string, data: DataExpression): CreateFn {
  return e.create(
    e.tag(tag),
    f.function(['ref'],
      e.data(data)
    )
  )
}

async function createTestModel(t: any) {
  let query = e.create(
    e.tag('_tag'),
    f.function(['ref'],
      e.data(
        d.struct({
            tag: d.string('modelA'),
            model: d.expr(
              e.create(
                e.tag('_model'),
                f.function(['ref'],
                  e.data(
                    m.struct({
                        text: m.string(),
                        owner: m.ref(d.expr(e.tag('_role')))
                      }
                    )
                  )
                )
              )
            )
          }
        )
      )
    )
  )
  return await t.context.exampleQuery(undefined, query)
}

async function createExpression(t: any) {
  const query = e.create(
    e.tag(DefaultTags.Expression),
    f.function(['ref'],
      e.data(
        createTypedExpression(
          f.function(['value'],
            e.switchModelRef(
              e.scope('value'),
              e.data(d.bool(false)),
              [
                {
                  match: e.tag('_role'),
                  return: d.bool(true)
                },
                {
                  match: e.tag('modelA'),
                  return: e.equal(
                    e.field('refRole', e.scope('value')),
                    e.first(
                      e.referred(
                        e.currentUser(),
                        e.tag('_role')
                      )
                    )
                  )
                }
              ]
            )
          )
        )
      )
    )
  )
  return await t.context.exampleQuery(undefined, query)
}

async function createRoleAndUser(t: any, expressionRef: any, group: string) {
  let query = create('_role',
    d.struct({
      name: d.string(group),
      permissions: d.struct({
        create: expressionRef,
        delete: expressionRef,
        read: expressionRef,
        update: expressionRef
      })
    }))
  const refRole = await t.context.exampleQuery(undefined, query)
  t.true(isRef(refRole))

  query = create('_user',
    d.struct({
      username: d.string(group),
      password: d.string('$2a$04$I/wYipwpWzai1f/7orFrFOudssqCr7/itDcaczlwmTtaCtkeb8QS6'),
      roles: d.list(
        d.ref(refRole)
      )
    })
  )
  await t.context.exampleQuery(undefined, query)
  t.true(isRef(refRole))

  return refRole
}
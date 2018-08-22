import {
  expression as e,
  data as d,
  buildExpression,
  isRef,
  DefaultTags,
  buildExpressions
} from '@karma.run/sdk'

import test from '../_before'

test('allReferrers', async t => {
  const modelResponse = await t.context.exampleQuery(
    'allReferrers_0',
    buildExpression(e =>
      e.util.createModels({
        modelA: m => m.string(),
        modelB: (m, d, r) => m.ref(d.expr(e => e.field('modelA', r))),
        modelC: (m, d, r) => m.ref(d.expr(e => e.field('modelA', r)))
      })
    )
  )

  const response = await t.context.exampleQuery(
    'allReferrers_1',
    ...buildExpressions(e => [
      e.define('record', e.create(e.data(d => d.ref(modelResponse.modelA)), () => e.string('foo'))),
      e.create(e.data(d => d.ref(modelResponse.modelB)), () => e.scope('record')),
      e.create(e.data(d => d.ref(modelResponse.modelC)), () => e.scope('record')),
      e.allReferrers(e.scope('record'))
    ])
  )

  t.true(Array.isArray(response))
  t.is(response.length, 2)
  t.true(isRef(response[0]))
  t.true(isRef(response[1]))
})

// TODO
test.skip('relocateRef', async t => {
  t.fail()
})

test('tagExists', async t => {
  const response = await t.context.exampleQuery(
    'tagExists_0',
    buildExpression(e =>
      e.data(d =>
        d.tuple(d.expr(e.tagExists(DefaultTags.User)), d.expr(e.tagExists('idonotexist')))
      )
    )
  )

  t.true(response[0])
  t.false(response[1])
})

test('tag', async t => {
  const response = await t.context.exampleQuery('tag_0', e.tag(e.data(d.string('_tag'))))

  t.true(Array.isArray(response))
  t.is(response.length, 2)
})

test('refTo', async t => {
  const response = await t.context.exampleQuery('refTo_0', e.refTo(e.first(e.all(e.tag('_tag')))))

  t.true(isRef(response))
})

test('ref', async t => {
  let response = await t.context.exampleQuery(
    undefined,
    e.metarialize(e.first(e.all(e.tag('_tag'))))
  )
  response = await t.context.exampleQuery('ref_0', e.data(d.ref(response.id)))

  t.truthy(response[0])
  t.truthy(response[1])
})

test('model', async t => {
  const tagResponse = await t.context.query(buildExpression(e => e.tag('_tag')))

  const response = await t.context.exampleQuery(
    'model_0',
    buildExpression(e => e.model(e.string(tagResponse[1])))
  )

  t.deepEqual(response, tagResponse)
})

test('referrers', async t => {
  let response = await t.context.exampleQuery(
    'referrers_0',
    e.referrers(e.refTo(e.first(e.all(e.tag('_role')))), e.tag('_user'))
  )
  t.truthy(response[0][0])
  t.truthy(response[0][1])
})

test('referred', async t => {
  let response = await t.context.exampleQuery(
    'referred_0',
    e.referred(e.refTo(e.first(e.all(e.tag('_user')))), e.tag('_role'))
  )
  t.truthy(response[0][0])
  t.truthy(response[0][1])
})

test('resolveAllRefs', async t => {
  let response = await t.context.exampleQuery(
    'resolveAllRefs_0',
    e.resolveAllRefs(e.resolveAllRefs(e.first(e.all(e.tag('_user')))))
  )

  t.deepEqual(response, {
    password: '',
    roles: [
      {
        name: 'admins',
        permissions: {
          create: {function: [['_'], [{data: {bool: true}}]]},
          delete: {function: [['_'], [{data: {bool: true}}]]},
          read: {function: [['_'], [{data: {bool: true}}]]},
          update: {function: [['_'], [{data: {bool: true}}]]}
        }
      }
    ],
    username: 'admin'
  })
})

test('resolveRefs', async t => {
  let response = await t.context.exampleQuery(
    'resolveRefs_0',
    buildExpression(e =>
      e.resolveRefs(e.resolveRefs(e.first(e.all(e.tag('_user'))), [e.tag('_role')]), [
        e.tag('_expression')
      ])
    )
  )

  t.deepEqual(response, {
    password: '',
    roles: [
      {
        name: 'admins',
        permissions: {
          create: {function: [['_'], [{data: {bool: true}}]]},
          delete: {function: [['_'], [{data: {bool: true}}]]},
          read: {function: [['_'], [{data: {bool: true}}]]},
          update: {function: [['_'], [{data: {bool: true}}]]}
        }
      }
    ],
    username: 'admin'
  })
})

test('graphFlow', async t => {
  const response = await t.context.exampleQuery(
    'graphFlow_0',
    buildExpression(e =>
      e.graphFlow(e.refTo(e.first(e.all(e.tag(DefaultTags.Role)))), [
        {
          from: e.tag('_role'),
          backward: [e.tag('_user')],
          forward: [e.tag('_expression')]
        }
      ])
    )
  )

  const modelEntries = Object.entries(response)
  t.is(modelEntries.length, 3)

  for (const [modelID, modelObj] of modelEntries) {
    const recordEntries = Object.entries(modelObj)
    t.is(recordEntries.length, 1)

    for (const [recordID, recordObj] of recordEntries) {
      t.truthy(modelID)
      t.truthy(modelObj)

      t.truthy(recordID)
      t.truthy(recordObj)
    }
  }
})

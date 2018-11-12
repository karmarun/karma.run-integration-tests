import {
  isRef,
} from '@karma.run/sdk'
import test from '../_before'
import { xpr as e, val as d, mod as m } from 'karma-sdk-typescript'

test('allReferrers', async t => {
  const metaRef = await t.context.adminSession.getMetaModelRef()
  const dataContext = e.DataContext

  const modelResponse = await t.context.exampleQuery('allReferrers_0',
    e.tag('_model').createMultiple({
      modelA: selfs => {
        return e.data(m.string.toValue(metaRef.id).toDataConstructor())
      },
      modelB: selfs => {
        const model = m.ref('placeholder')
        return e.data(model.toValue(metaRef.id).toDataConstructor().transform(ctor => {
          if (ctor instanceof e.RefConstructor && ctor.id === 'placeholder') {
            return dataContext.expr(selfs.field('modelA'))
          }
          return ctor
        }))
      },
      modelC: selfs => {
        const model = m.ref('placeholder')
        return e.data(model.toValue(metaRef.id).toDataConstructor().transform(ctor => {
          if (ctor instanceof e.RefConstructor && ctor.id === 'placeholder') {
            return dataContext.expr(selfs.field('modelA'))
          }
          return ctor
        }))
      },
    })
  )


  const response = await t.context.exampleQuery('allReferrers_1',
    e.define('record', e.create(
      e.data(d.ref(modelResponse.modelA[0], modelResponse.modelA[1]).toDataConstructor()),
      arg => e.data(d.string("foo").toDataConstructor())
      )
    ),
    e.create(
      e.data(d.ref(modelResponse.modelB[0], modelResponse.modelB[1]).toDataConstructor()),
      arg => e.scope('record')
    ),
    e.create(
      e.data(d.ref(modelResponse.modelC[0], modelResponse.modelC[1]).toDataConstructor()),
      arg => e.scope('record')
    ),
    e.allReferrers(e.scope('record'))
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
  const dataContext = e.DataContext

  const response = await t.context.exampleQuery('tagExists_0',
    e.data(
      dataContext.tuple(
        dataContext.expr(e.tagExists(e.string("_role"))),
        dataContext.expr(e.tagExists(e.string("idonotexist"))),
      )
    )
  )

  t.true(response[0])
  t.false(response[1])
})

test('tag', async t => {
  const response = await t.context.exampleQuery('tag_0',
    e.tag(e.string('_tag'))
  )

  t.true(Array.isArray(response))
  t.is(response.length, 2)
})

test('refTo', async t => {
  const response = await t.context.exampleQuery('refTo_0',
    e.refTo(e.first(e.all(e.tag('_tag')))))

  t.true(isRef(response))
})

test('ref', async t => {
  let response = await t.context.exampleQuery(undefined,
    e.metarialize(e.first(e.all(e.tag('_tag'))))
  )
  response = await t.context.exampleQuery('ref_0', e.data(d.ref(response.id[0], response.id[1]).toDataConstructor()))

  t.truthy(response[0])
  t.truthy(response[1])
})

test('model', async t => {
  const tagResponse = await t.context.exampleQuery(undefined,
    e.tag('_tag')
  )

  const response = await t.context.exampleQuery('model_0',
    e.model(e.string(tagResponse[1]))
  )

  t.deepEqual(response, tagResponse)
})

test('referrers', async t => {
  let response = await t.context.exampleQuery('referrers_0',
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
  let response = await t.context.exampleQuery('resolveAllRefs_0',
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
  let response = await t.context.exampleQuery('resolveRefs_0',
    e.resolveRefs(
      e.resolveRefs(e.first(e.all(e.tag('_user'))),
        e.tag('_role')
      ),
      e.tag('_expression')
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

test.skip('graphFlow', async t => {
  // const response = await t.context.exampleQuery('graphFlow_0',
  //
  //   e.graphFlow(e.refTo(e.first(e.all(e.tag('_role')))), [
  //     {
  //       from: e.tag('_role'),
  //       backward: [e.tag('_user')],
  //       forward: [e.tag('_expression')]
  //     }
  //   ])
  // )
  //
  // const modelEntries = Object.entries(response)
  // t.is(modelEntries.length, 3)
  //
  // for (const [modelID, modelObj] of modelEntries) {
  //   const recordEntries = Object.entries(modelObj)
  //   t.is(recordEntries.length, 1)
  //
  //   for (const [recordID, recordObj] of recordEntries) {
  //     t.truthy(modelID)
  //     t.truthy(modelObj)
  //
  //     t.truthy(recordID)
  //     t.truthy(recordObj)
  //   }
  // }
})

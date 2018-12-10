import test from '../../utils/_before'

import * as e from '@karma.run/sdk/expression'
import * as m from '@karma.run/sdk/model'
import * as d from '@karma.run/sdk/value'

import {isRef} from '../../utils/_utility'

test('modelOf', async t => {
  const response = await t.context.exampleQuery('modelOf_0',
    e.modelOf(e.data(d.struct({
      foo: d.string('foo'),
      bar: d.int32(0)
    }).toDataConstructor()))
  )

  t.deepEqual(response, {
    struct: {
      foo: {string: {}},
      bar: {int32: {}}
    }
  })
})

test('metarialize', async t => {
  const response = await t.context.exampleQuery('metarialize_0',
    e.metarialize(e.first(e.all(e.tag('_tag'))))
  )

  t.is(typeof response, 'object')
  t.true(Array.isArray(response.id))
  t.is(typeof response.created, 'string')
  t.is(typeof response.updated, 'string')
  t.is(typeof response.value, 'object')
})

// TODO: Test some more zeroable and unzeroable types.
test('zero', async t => {
  const metaRef = await t.context.adminSession.getMetaModelRef()
  const dataContext = e.DataContext

  const model = m.struct({
    foo: m.string,
    bar: m.int32
  })

  const modelResponse: [string, string] = await t.context.exampleQuery(undefined,
    e.create(e.tag('_model'),
      arg => e.data(model.toValue(metaRef.id).toDataConstructor())
    )
  )

  const response = await t.context.exampleQuery('zero_0',
    e.define('record', e.create(
      e.data(dataContext.ref(modelResponse[0], modelResponse[1])),
      arg => e.zero()
      )
    ),
    e.get(e.scope('record'))
  )

  t.deepEqual(response, {foo: '', bar: 0})
})

test('currentUser', async t => {
  const response = await t.context.exampleQuery('currentUser_0',
    e.currentUser()
  )

  t.true(isRef(response))
})

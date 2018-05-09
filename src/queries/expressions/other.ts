import { buildExpression as build, createModel } from 'karma.run'
import test from '../_before'

test('model', async t => {
  const tagResponse = await t.context.query(build(e =>
    e.tag('_tag')
  ))

  const response = await t.context.exampleQuery('model_0', build(e =>
    e.model(e.string(tagResponse[1]))
  ))

  t.deepEqual(response, tagResponse)
})

test('modelOf', async t => {
  const response = await t.context.exampleQuery('modelOf_0', build(e =>
    e.modelOf(e.data(d => d.struct({
      foo: d.string('foo'),
      bar: d.int32(0)
    })))
  ))

  t.deepEqual(response, {
    struct: {
      foo: {string: {}},
      bar: {int32: {}}
    }
  })
})

test('metarialize', async t => {
  const response = await t.context.exampleQuery('metarialize_0', build(e =>
    e.metarialize(e.first(e.all(e.tag('_tag'))))
  ))

  t.is(typeof response, 'object')
  t.true(Array.isArray(response.id))
  t.is(typeof response.created, 'string')
  t.is(typeof response.updated, 'string')
  t.is(typeof response.value, 'object')
})

// TODO: Test some more zeroable and unzeroable types.
test('zero', async t => {
  const modelResponse: [string, string] = await t.context.query(build(e =>
    createModel(m =>
      m.struct({
        foo: m.string(),
        bar: m.int32()
      }),
    e)
  ))

  const response = await t.context.exampleQuery('zero_0',
    build(e =>
      e.define('record', e.create(
        e.data(d => d.ref(modelResponse[0], modelResponse[1])),
        () => e.zero()
      ))
    ),

    build(e =>
      e.get(e.scope('record'))
    ),
  )

  t.deepEqual(response, {foo: '', bar: 0})
})

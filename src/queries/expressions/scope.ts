import { buildExpression as build, isRef } from '@karma.run/sdk'
import test from '../_before'

test('data', async t => {
  const response = await t.context.exampleQuery(undefined, build(e =>
    e.data(d => d.list(
      d.expr(e => e.tag('_tag')),
      d.expr(e => e.tag('_user'))
    ))
  ))

  t.true(Array.isArray(response))
  t.true(isRef(response[0]))
  t.true(isRef(response[1]))
})

test('define/scope', async t => {
  const response = await t.context.exampleQuery(undefined,
    build(e => e.define('foo', e.string('bar'))),
    build(e => e.scope('foo'))
  )

  t.is(response, 'bar')
})

test('signature', async t => {
  const response = await t.context.exampleQuery(undefined, build(e =>
    e.signature((param) => e.tag(param))
  ))

  t.true(Array.isArray(response))
  t.true(typeof response[0] === 'object')
  t.true(isRef(response[1].ref))
})

test('with', async t => {
  const response = await t.context.exampleQuery('with_0', build(e =>
    e.with(e.string('foo'), value => value)
  ))

  t.is(response, 'foo')
})

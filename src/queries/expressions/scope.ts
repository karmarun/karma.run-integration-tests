import test from '../_before'

import * as e from '@karma.run/sdk/expression'
import {isRef} from '../utility'

test('data', async t => {
  const response = await t.context.exampleQuery(undefined,
    e.data(d => d.list([
      d.expr(e.tag('_tag')),
      d.expr(e.tag('_user'))
    ]))
  )

  t.true(Array.isArray(response))
  t.true(isRef(response[0]))
  t.true(isRef(response[1]))
})

test.skip('define/scope', async t => {
  // const response = await t.context.exampleQuery(undefined,
  //    e.define('foo', e.string('bar'))),
  //    e.scope('foo')
  // )
  //
  // t.is(response, 'bar')
})

test.skip('signature', async t => {
  // const dataContext = e.DataContext
  //
  // const response = await t.context.exampleQuery(undefined,
  //   e.signature((param) => e.tag(param))
  // )
  //
  // t.true(Array.isArray(response))
  // t.true(typeof response[0] === 'object')
  // t.true(isRef(response[1].ref))
})

test('with', async t => {
  const response = await t.context.exampleQuery('with_0',
    e.with_(e.string('foo'), value => value)
  )

  t.is(response, 'foo')
})

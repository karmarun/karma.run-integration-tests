import { buildExpression as build } from 'karma.run'
import test from '../_before'

test('after', async t => {
  const response = await t.context.exampleQuery('bool_0', build(e =>
    e.after(new Date(0), new Date(1))
  ))

  t.is(response, false)
})

test('before', async t => {
  const response = await t.context.exampleQuery('bool_0', build(e =>
    e.before(new Date(0), new Date(1))
  ))

  t.is(response, true)
})

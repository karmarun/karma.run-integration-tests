import { buildExpression as build } from '@karma.run/sdk'
import test from '../_before'

test('isCase', async t => {
  const response = await t.context.exampleQuery('isCase_0', build(e =>
    e.data(d => d.list(
      d.expr(e => e.isCase(e.string('foo'), e.data(d => d.union('foo', d.string('bar'))))),
      d.expr(e => e.isCase(e.string('bar'), e.data(d => d.union('foo', d.string('bar')))))
    ))
  ))

  t.deepEqual(response, [true, false])
})

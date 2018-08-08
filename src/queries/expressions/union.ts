import { buildExpression as build } from '@karma.run/sdk'
import test from '../_before'

test('isCase', async t => {
  const response = await t.context.exampleQuery('isCase_0', build(e =>
    e.data(d => d.list(
      d.expr(e => e.isCase(e.data(d => d.union('foo', d.string('bar'))), e.string('foo'))),
      d.expr(e => e.isCase(e.data(d => d.union('foo', d.string('bar'))), e.string('bar')))
    ))
  ))

  t.deepEqual(response, [true, false])
})

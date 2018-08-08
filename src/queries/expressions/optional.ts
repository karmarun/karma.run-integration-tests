import { buildExpression as build } from '@karma.run/sdk'
import test from '../_before'

test('isPresent', async t => {
  const response = await t.context.exampleQuery('isPresent_0', build(e =>
    e.data(d => d.list(
      d.expr(e => e.isPresent(e.string('foo'))),
      d.expr(e => e.isPresent(e.null()))
    ))
  ))

  t.deepEqual(response, [true, false])
})

// TODO: Test model with optionals
test.skip('presentOrZero', async t => {
  const response = await t.context.exampleQuery('presentOrZero_0', build(e =>
    e.data(d => d.list(
      d.expr(e => e.addInt8(5, e.presentOrZero(e.null()))),
      d.expr(e => e.addInt8(5, e.presentOrZero(e.int8(10))))
    ))
  ))

  t.deepEqual(response, [5, 15])
})

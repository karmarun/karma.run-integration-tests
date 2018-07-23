import { buildExpression as build } from '@karma.run/sdk'
import test from '../_before'

test('indexTuple', async t => {
  const response = await t.context.exampleQuery('key_0', build(e =>
    e.indexTuple(0, e.data(d => d.tuple(d.int8(1), d.int8(2), d.int8(3))))
  ))

  t.is(response, 1)
})

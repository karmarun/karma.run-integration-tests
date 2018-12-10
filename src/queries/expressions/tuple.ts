import test from '../_before'

import * as e from '@karma.run/sdk/expression'
import * as d from '@karma.run/sdk/value'

test('indexTuple', async t => {
  const response = await t.context.exampleQuery('indexTuple_0',
    e.indexTuple(
      0,
      e.data(
        d.tuple(
          d.int8(1),
          d.int8(2),
          d.int8(3),
        ).toDataConstructor()
      )
    )
  )

  t.is(response, 1)
})

import test from '../_before'
import { xpr as e, val as d } from 'karma-sdk-typescript'

test.failing('indexTuple', async t => {
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

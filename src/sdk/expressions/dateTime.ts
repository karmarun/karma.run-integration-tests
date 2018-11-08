import test from '../_before'
import { xpr as e, val as d } from 'karma-sdk-typescript'

test('after', async t => {
  const response = await t.context.exampleQuery('after_0',
    e.after(
      e.data(d.dateTime(new Date(0)).toDataConstructor()),
      e.data(d.dateTime(new Date(1)).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('before', async t => {
  const response = await t.context.exampleQuery('before_0',
    e.before(
      e.data(d.dateTime(new Date(0)).toDataConstructor()),
      e.data(d.dateTime(new Date(1)).toDataConstructor()),
    )
  )

  t.is(response, true)
})
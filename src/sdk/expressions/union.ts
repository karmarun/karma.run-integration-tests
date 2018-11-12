import test from '../_before'
import { xpr as e, val as d } from 'karma-sdk-typescript'

test('isCase', async t => {
  let response = await t.context.exampleQuery('isCase_0',
    e.isCase(
      e.string('foo'),
      e.data(d.union('foo', d.string('bar')).toDataConstructor()),
    )
  )

  t.true(response)

  response = await t.context.exampleQuery('isCase_1',
    e.isCase(
      e.string('bar'),
      e.data(d.union('foo', d.string('bar')).toDataConstructor()),
    )
  )

  t.false(response)
})

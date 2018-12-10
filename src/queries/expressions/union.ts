import test from '../../utils/_before'

import * as e from '@karma.run/sdk/expression'
import * as d from '@karma.run/sdk/value'

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

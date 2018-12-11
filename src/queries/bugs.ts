import test from '../utils/_before'
import * as e from '@karma.run/sdk/expression'

test('zeroStackOverflow', async t => {
  const error = await t.throws(async () => {
    await t.context.exampleQuery(undefined,
      e.create(
        e.tag('_model'),
        () => e.zero()
      )
    )
  }, Error)
  t.truthy(error)
})
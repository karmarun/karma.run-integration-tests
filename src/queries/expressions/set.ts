import { buildExpression as build, isRef } from '@karma.run/sdk'
import test from '../_before'

test('mapSet', async t => {
  const response = await t.context.exampleQuery('mapSet_0', build(e =>
    e.mapSet(
      e.data(d => d.set(
        d.string('_tag'),
        d.string('_tag'),
        d.string('_user')
      )),
      (value) => e.tag(value)
    )
  ))

  t.true(Array.isArray(response))
  t.true(isRef(response[0]))
  t.true(isRef(response[1]))
})
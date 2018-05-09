import { buildExpression as build } from 'karma.run'
import test from '../_before'
import { isReference } from '../../helpers/_karma'

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
  t.true(isReference(response[0]))
  t.true(isReference(response[1]))
})
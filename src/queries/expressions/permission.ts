import { build } from 'karma.run'
import test from '../_before'
import { isReference } from '../../helpers/_karma'

test('currentUser', async t => {
  const response = await t.context.exampleQuery('and_0',
    build(e => e.currentUser())
  )

  t.true(isReference(response))
})

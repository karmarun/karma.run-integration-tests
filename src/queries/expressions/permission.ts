import { buildExpression as build } from '@karma.run/sdk'

import test from '../_before'
import { isReference } from '../../helpers/_karma'

test('currentUser', async t => {
  const response = await t.context.exampleQuery(undefined, build(e =>
    e.currentUser()
  ))

  t.true(isReference(response))
})

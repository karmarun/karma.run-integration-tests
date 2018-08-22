import { buildExpression as build, isRef } from '@karma.run/sdk'
import test from '../_before'

test('currentUser', async t => {
  const response = await t.context.exampleQuery(undefined, build(e =>
    e.currentUser()
  ))

  t.true(isRef(response))
})

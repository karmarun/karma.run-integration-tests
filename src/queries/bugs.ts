import test from '../utils/_before'
import * as e from '@karma.run/sdk/expression'
import * as m from '@karma.run/sdk/model'
import * as d from '@karma.run/sdk/value'
import * as utl from '@karma.run/sdk/utility'

import { isRef } from '../utils/_utility'

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
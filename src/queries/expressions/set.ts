import test from '../../utils/_before'

import * as e from '@karma.run/sdk/expression'
import * as d from '@karma.run/sdk/value'

import {isRef} from '../../utils/_utility'

test('mapSet', async t => {
  const response = await t.context.exampleQuery('mapSet_0',
    e.mapSet(
      e.data(d.set([
        d.string('_tag'),
        d.string('_tag'),
        d.string('_user'),
      ]).toDataConstructor()),
      (value) => e.tag(value)
    )
  )

  t.true(Array.isArray(response))
  t.true(isRef(response[0]))
  t.true(isRef(response[1]))
})
import test from '../_before'
import { isRef } from '@karma.run/sdk'
import { xpr as e, val as d } from 'karma-sdk-typescript'

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
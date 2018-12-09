import test from '../_before'

import * as e from '@karma.run/sdk/expression'
import * as d from '@karma.run/sdk/value'

import {isRef} from '../utility'

// TODO: Test more extensively.
test('extractStrings', async t => {
  const response = await t.context.exampleQuery('extractStrings_0',
    e.extractStrings(e.data(
      d.struct({
        a: d.int8(1),
        b: d.string('foo'),
        c: d.struct({
          list: d.list([
            d.string('bar'),
            d.string('baz'),
          ]),
        })
      }).toDataConstructor()
    ))
  )

  t.deepEqual(response, ['bar', 'baz', 'foo'])
})

test('field', async t => {
  const response = await t.context.exampleQuery('field_0',
    e.field('a',
      e.data(d.struct({
          a: d.int8(1),
          b: d.int8(2),
          c: d.int8(3)
        }).toDataConstructor()
      )
    )
  )

  t.is(response, 1)
})

test('setField', async t => {
  const response = await t.context.exampleQuery('setField_0',
    e.setField('d', e.int8(4), e.data(
      d.struct({
          a: d.int8(1),
          b: d.int8(2),
          c: d.int8(3)
        }
      ).toDataConstructor())
    )
  )

  t.deepEqual(response, {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  })
})

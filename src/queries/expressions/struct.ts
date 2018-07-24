import { buildExpression as build } from '@karma.run/sdk'
import test from '../_before'

// TODO: Test more extensively.
test('extractStrings', async t => {
  const response = await t.context.exampleQuery('extractStrings_0', build(e =>
    e.extractStrings(e.data(d =>
      d.struct({
        a: d.int8(1),
        b: d.string('foo'),
        c: d.struct({
          list: d.list(
            d.string('bar'),
            d.string('baz')
          ),
        })
      })
    ))
  ))

  t.deepEqual(response, ['bar', 'baz', 'foo'])
})

test('field', async t => {
  const response = await t.context.exampleQuery('field_0', build(e =>
    e.field('a', e.data(d => d.struct({
        a: d.int8(1),
        b: d.int8(2),
        c: d.int8(3)}
      ))
    )
  ))

  t.is(response, 1)
})

test('setField', async t => {
  const response = await t.context.exampleQuery('setField_0', build(e =>
    e.setField('d', e.int8(4), e.data(d => d.struct({
        a: d.int8(1),
        b: d.int8(2),
        c: d.int8(3)}
      ))
    )
  ))

  t.deepEqual(response, {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  })
})

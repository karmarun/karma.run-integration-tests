import { buildExpression as build } from '@karma.run/sdk'
import test from '../_before'

test('key', async t => {
  const response = await t.context.exampleQuery('key_0', build(e =>
    e.key('a', e.data(d => d.map({
        a: d.int8(1),
        b: d.int8(2),
        c: d.int8(3)}
      ))
    )
  ))

  t.is(response, 1)
})

test('mapMap', async t => {
  const response = await t.context.exampleQuery('mapMap_0', build(e =>
    e.mapMap(
      e.data(d => d.map({
        a: d.int8(1),
        b: d.int8(2),
        c: d.int8(3)}
      )),
      (_, value) => e.addInt8(value, 1)
    )
  ))

  t.deepEqual(response, {
    a: 2,
    b: 3,
    c: 4
  })
})

test('setKey', async t => {
  const response = await t.context.exampleQuery('setKey_0', build(e =>
    e.setKey('d', e.int8(4), e.data(d => d.map({
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

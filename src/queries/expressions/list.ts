import { buildExpression as build } from 'karma.run'
import test from '../_before'

test('concatLists', async t => {
  const response = await t.context.exampleQuery('concatLists_0', build(e =>
    e.concatLists(
      e.data(d => d.list(d.int8(1), d.int8(2), d.int8(3))),
      e.data(d => d.list(d.int8(4), d.int8(5), d.int8(6)))
    )
  ))

  t.deepEqual(response, [1, 2, 3, 4, 5, 6])
})

test('filterList', async t => {
  const response = await t.context.exampleQuery('filterList_0', build(e =>
    e.filterList(
      e.data(d => d.list(d.int8(3), d.int8(2), d.int8(1))),
      (_, value) => e.gtInt8(value, e.data(d => d.int8(2)))
    )
  ))

  t.deepEqual(response, [3])
})

test('first', async t => {
  const response = await t.context.exampleQuery('first_0', build(e =>
    e.first(
      e.data(d =>
        d.list(
          d.int8(3),
          d.int8(2),
          d.int8(1)
        )
      )
    )
  ))

  t.is(response, 3)
})

test('inList', async t => {
  let response = await t.context.exampleQuery('inList_0', build(e =>
    e.inList(
      e.data(d => d.list(
        d.string('foo'),
        d.int8(10),
        d.int8(15)
      )),
      e.string('foo')
    )
  ))

  t.true(response)

  response = await t.context.exampleQuery('inList_1', build(e =>
    e.inList(
      e.data(d => d.list(
        d.string('foo'),
        d.int8(10),
        d.int8(15)
      )),
      e.string('bar')
    )
  ))

  t.false(response)
})

test('mapList', async t => {
  const response = await t.context.exampleQuery('mapList_0', build(
    e => e.mapList(
      e.all(e.tag('_tag')),
      (_, value) => e.field('tag', value)
    )
  ))

  t.deepEqual(response.sort(), [
    '_expression', '_migration', '_model', '_role', '_tag', '_user'
  ].sort())
})

test('length', async t => {
  const response = await t.context.exampleQuery('length_0', build(e =>
    e.length(e.all(e.tag('_tag')))
  ))

  t.deepEqual(response, 6)
})

test('memSort', async t => {
  const response = await t.context.exampleQuery('memSort_0', build(e =>
    e.memSort(
      e.data(d => d.list(d.int8(3), d.int8(2), d.int8(1))),
      (value) => value
    )
  ))

  t.deepEqual(response, [1, 2, 3])
})

test('reverseList', async t => {
  const response = await t.context.exampleQuery('concatLists_0', build(e =>
    e.reverseList(
      e.data(d => d.list(d.int8(1), d.int8(2), d.int8(3)))
    )
  ))

  t.deepEqual(response, [3, 2, 1])
})
test('slice', async t => {
  const response = await t.context.exampleQuery('concatLists_0', build(e =>
    e.slice(
      e.data(d => d.list(d.int8(1), d.int8(2), d.int8(3))),
      1, 2
    )
  ))

  t.deepEqual(response, [2, 3])
})

test('reduceList', async t => {
  const response = await t.context.exampleQuery('reduceList_0', build(e =>
    e.reduceList(
      e.data(d => d.list(d.int8(5), d.int8(10), d.int8(15))),
      e.int8(0),
      (value, nextValue) => e.addInt8(value, nextValue)
    )
  ))

  t.is(response, 30)
})

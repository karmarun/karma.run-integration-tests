
import { data as d, expression as e, func as f, build } from 'karma.run'
import test from '../_before'

test('length', async t => {
  const response = await t.context.exampleQuery('length_0',
    e.length(e.all(e.tag(e.data(d.string('_tag')))))
  )

  t.deepEqual(response, 6)
})

test('filterList', async t => {
  const response = await t.context.exampleQuery('filterList_0',
    e.filterList(
      e.data(
        d.list(
          d.int8(3),
          d.int8(2),
          d.int8(1)
        )
      ),
      f.function(['list', 'value'], e.gtInt8(e.scope('value'), e.data(d.int8(2))))
    )
  )

  t.deepEqual(response, [3])
})

test('mapList', async t => {
  const response = await t.context.exampleQuery(
    'mapList_0',
    build(
      e => e.mapList(
        e.all(e.tag('_tag')),
        (_, value) => e.field('tag', value)
      )
    )
  )

  t.deepEqual(response.sort(), [
    '_expression', '_migration', '_model', '_role', '_tag', '_user'
  ].sort())
})

test('reduceList', async t => {
  const response = await t.context.exampleQuery(
    'reduceList_0',
    build(e =>
      e.reduceList(
        e.data(d => d.list(d.int8(5), d.int8(10), d.int8(15))),
        e.int8(0),
        (value, nextValue) => e.addInt8(value, nextValue)
      )
    )
  )


  t.is(response, 30)
})

test('first', async t => {
  const response = await t.context.exampleQuery('first_0',
    e.first(e.data(
      d.list(
        d.int8(3),
        d.int8(2),
        d.int8(1)
      )
    ))
  )

  t.is(response, 3)
})

test('inList', async t => {
  let response = await t.context.exampleQuery('inList_0',
    e.inList(
      e.data(d.list(
        d.string('foo'),
        d.int8(10),
        d.int8(15)
      )),
      e.data(d.string('foo'))
    )
  )

  t.true(response)

  response = await t.context.exampleQuery('inList_1',
    e.inList(
      e.data(d.list(
        d.string('foo'),
        d.int8(10),
        d.int8(15)
      )),
      e.data(d.string('bar'))
    )
  )

  t.false(response)
})

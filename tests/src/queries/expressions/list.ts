
import { data as d, expression as e, func as f } from 'karma.run'
import test from '../_before'

test('length', async t => {
  const response = await t.context.exampleQuery('length_0',
    e.length(e.all(e.tag(d.data(d.string('_tag')))))
  )

  t.deepEqual(response, 6)
})

test('filterList', async t => {
  const response = await t.context.exampleQuery('filterList_0',
    e.filterList(
      d.data(
        d.list(
          d.int8(3),
          d.int8(2),
          d.int8(1)
        )
      ),
      f.func(['list', 'value'], e.gtInt8(f.scope('value'), d.data(d.int8(2))))
    )
  )

  t.deepEqual(response, [3])
})

test('mapList', async t => {
  const response = await t.context.exampleQuery(
    'mapList_0',
    e.mapList(
      e.all(e.tag(d.string('_tag'))),
      f.func(['index', 'value'], e.field('tag', f.scope('value')))
    )
  )

  t.deepEqual(response.sort(), [
    '_expression', '_migration', '_model', '_role', '_tag', '_user'
  ].sort())
})

test('reduceList', async t => {
  const response = await t.context.exampleQuery(
    'reduceList_0',
    e.reduceList(
      d.data(d.list(d.int8(5), d.int8(10), d.int8(15))),
      d.data(d.int8(0)),
      f.func(['value', 'nextValue'], e.addInt8(f.scope('value'), f.scope('nextValue')))
    )
  )

  t.is(response, 30)
})

test('first', async t => {
  const response = await t.context.exampleQuery('first_0',
    e.first(d.data(
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
      d.data(d.list(
        d.string('foo'),
        d.int8(10),
        d.int8(15)
      )),
      d.data(d.string('foo'))
    )
  )

  t.true(response)

  response = await t.context.exampleQuery('inList_1',
    e.inList(
      d.data(d.list(
        d.string('foo'),
        d.int8(10),
        d.int8(15)
      )),
      d.data(d.string('bar'))
    )
  )

  t.false(response)
})

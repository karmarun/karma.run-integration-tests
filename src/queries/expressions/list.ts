import test from '../../utils/_before'

import * as e from '@karma.run/sdk/expression'
import * as m from '@karma.run/sdk/model'
import * as d from '@karma.run/sdk/value'
import * as utl from '@karma.run/sdk/utility'

import { isRef } from '../../utils/_utility'

test('concatLists', async t => {
  const response = await t.context.exampleQuery('concatLists_0',
    e.concatLists(
      e.data(d.list([d.int8(1), d.int8(2), d.int8(3)]).toDataConstructor()),
      e.data(d.list([d.int8(4), d.int8(5), d.int8(6)]).toDataConstructor())
    )
  )

  t.deepEqual(response, [1, 2, 3, 4, 5, 6])
})

test('filterList', async t => {
  const response = await t.context.exampleQuery(
    'filterList_0',
    e.filterList(
      e.data(d.list([d.int8(3), d.int8(2), d.int8(1)]).toDataConstructor()),
      (index, value) => {
        return e.gtInt8(
          value,
          e.data(d.int8(2).toDataConstructor())
        )
      }
    )
  )

  t.deepEqual(response, [3])
})

test('first', async t => {
  const response = await t.context.exampleQuery('first_0',
    e.first(e.data(
      d.list([d.int8(3), d.int8(2), d.int8(1)]).toDataConstructor()
    ))
  )

  t.is(response, 3)
})

test('inList', async t => {
  let response = await t.context.exampleQuery('inList_0',

    e.inList(e.data(
      d.list([
        d.string('foo'),
        d.int8(10),
        d.int8(15)
      ]).toDataConstructor()
    ), e.string('foo'))
  )

  t.true(response)

  response = await t.context.exampleQuery('inList_1',
    e.inList(e.data(
      d.list([
        d.string('foo'),
        d.int8(10),
        d.int8(15)
      ]).toDataConstructor()
    ), e.string('bar'))
  )

  t.false(response)
})

test('mapList', async t => {
  const response = await t.context.exampleQuery('mapList_0',
    e.mapList(e.all(e.tag('_tag')),
      (_, value) => e.field('tag', value)
    )
  )

  t.deepEqual(
    response.sort(),
    ['_expression', '_migration', '_model', '_role', '_tag', '_user'].sort()
  )
})

test('length', async t => {
  const response = await t.context.exampleQuery('length_0',
    e.length(e.all(e.tag('_tag')))
  )

  t.deepEqual(response, 6)
})

test('memSort', async t => {
  const response = await t.context.exampleQuery('memSort_0',
    e.memSort(e.data(d.list([d.int8(2), d.int8(8), d.int8(4)]).toDataConstructor()), value => value)
  )

  t.deepEqual(response, [2, 4, 8])
})

test('memSortFunction', async t => {
  const response = await t.context.exampleQuery('memSortFunction_0',
    e.memSortFunction(e.data(
      d.list([
        d.int8(2), d.int8(8), d.int8(4)
      ]).toDataConstructor()
    ), (valueA, valueB) =>
        e.gtInt8(valueA, valueB)
    )
  )

  t.deepEqual(response, [8, 4, 2])
})

test('reverseList', async t => {
  const response = await t.context.exampleQuery('reverseList_0',
    e.reverseList(e.data(d.list([d.int8(1), d.int8(2), d.int8(3)]).toDataConstructor()))
  )

  t.deepEqual(response, [3, 2, 1])
})

test('slice', async t => {
  const response = await t.context.exampleQuery('slice_0',
    e.slice(e.data(d.list([d.int8(1), d.int8(2), d.int8(3)]).toDataConstructor()), 1, 2)
  )

  t.deepEqual(response, [2, 3])
})

test('reduceList', async t => {
  const response = await t.context.exampleQuery('reduceList_0',
    e.reduceList(
      e.data(
        d.list([
          d.int8(5), d.int8(10), d.int8(15)
        ]).toDataConstructor()
      ),
      e.int8(0),
      (value, nextValue) => e.addInt8(value, nextValue)
    )
  )

  t.is(response, 30)
})

test('leftFoldList', async t => {
  const dc = e.DataContext

  const response = await t.context.exampleQuery('leftFoldList_0',
    e.leftFoldList(
      e.data(d.list([d.string('bar'), d.string('baz')]).toDataConstructor()),
      e.data(d.struct({ value: d.string('foo') }).toDataConstructor()),
      (aggregator, value) =>
        e.setField(
          'value',
          e.joinStrings(
            e.data(dc.list([
              dc.expr(e.field('value', aggregator)),
              dc.expr(value)
            ])),
            e.string(' '),
          ),
          aggregator
        )
    )
  )

  t.deepEqual(response, { value: 'foo bar baz' })
})

test('rightFoldList', async t => {
  const dc = e.DataContext

  const response = await t.context.exampleQuery('rightFoldList_0',
    e.rightFoldList(
      e.data(d.list([d.string('bar'), d.string('baz')]).toDataConstructor()),
      e.data(d.struct({ value: d.string('foo') }).toDataConstructor()),
      (aggregator, value) =>
        e.setField(
          'value',
          e.joinStrings(
            e.data(dc.list([
              dc.expr(e.field('value', aggregator)),
              dc.expr(value),
            ])),
            e.string(' '),
          ),
          aggregator
        )
    )
  )

  t.deepEqual(response, { value: 'foo baz bar' })
})




test('createEmpty', async t => {

  const model = m.struct({
    myList: m.list(m.struct({
      a: m.string
    })),
  })

  const modelRef = await t.context.exampleQuery(undefined,
    utl.createModelsAndTags({
      model
    })
  )
  t.true(modelRef && isRef(modelRef.model))

  const createMultiple = e.createMultiple(
    e.tag('model'),
    {
      exampleA: refs => {
        return e.data(d.struct({
          myList: d.list([d.struct({
            a: d.string('a')
          })]),
        }).toDataConstructor())
      },
      exampleB: refs => {
        return e.data(d.struct({
          myList: d.list([]),
        }).toDataConstructor())
      },
      exampleC: refs => {
        return e.data(model.decode(
          {
            myList: [],
          }
        ).toDataConstructor())
      },
    }
  )

  const result = await t.context.exampleQuery(undefined, createMultiple)
  t.true(result && isRef(result.exampleA))
})

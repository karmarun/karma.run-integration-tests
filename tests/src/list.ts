
import { data as d, expression as e, func as f } from 'karma.run'
import test from './_before'

test('mapList', async t => {
  const response = await t.context.exampleQuery(
    'mapList_0',
    e.mapList(
      e.all(e.tag(d.string('_tag'))),
      f.func(['index', 'value'], e.field('tag', e.scope('value')))
    )
  )

  t.deepEqual(response.sort(), [
    '_expression', '_migration', '_model', '_role', '_tag', '_user'
  ].sort())
})


// test('reduceList', async t => {
//   const response = await karmaApi.tQuery(t, [
//     "reduceList", {
//       "value": [
//         "list",
//         [["int8", 5], ["int8", 10], ["int8", 15]]
//       ],
//       "expression": [
//         "add", [
//           [
//             "index", {
//             "number": 0,
//             "value": {
//               "arg": {}
//             }
//           }
//           ],
//           [
//             "index", {
//             "number": 1,
//             "value": {
//               "arg": {}
//             }
//           }
//           ]
//         ]
//       ]
//     }
//   ])
//   t.is(response.status, 200, JSON.stringify(response.body))
//   t.is(response.body, 10)
//   console.log(response.body[1].human)
// })

test('length', async t => {
  const response = await t.context.exampleQuery('length_0',
    e.length(e.all(e.tag(d.data(d.string('_tag')))))
  )

  t.deepEqual(response, 6)
})

test('first', async t => {
  const response = await t.context.exampleQuery('first_0',
    e.first(e.all(e.tag(d.data(d.string('_tag')))))
  )

  t.truthy(response)
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

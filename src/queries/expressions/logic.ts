import test from '../../utils/_before'

import * as e from '@karma.run/sdk/expression'
import * as d from '@karma.run/sdk/value'

import {isRef} from '../../utils/_utility'

test('and', async t => {
  const response = await t.context.exampleQuery('and_0',
    e.and(
      e.data(d.bool(true).toDataConstructor()),
      e.data(d.bool(false).toDataConstructor())),
  )
  t.deepEqual(response, false)
})

test('or', async t => {
  const response = await t.context.exampleQuery('or_0',
    e.or(
      e.data(d.bool(true).toDataConstructor()),
      e.data(d.bool(false).toDataConstructor()),
    )
  )
  t.deepEqual(response, true)
})

test('equal', async t => {
  const response = await t.context.exampleQuery(
    'equal_0',
    e.equal(e.string('foo'), e.string('bar'))
  )

  t.deepEqual(response, false)
})

test('and all', async t => {
  const vFalse = e.data(d.bool(false).toDataConstructor())
  const vTrue = e.data(d.bool(true).toDataConstructor())

  const response = await t.context.exampleQuery(undefined,
    e.data(d =>
      d.list([
        d.expr(e.and(vFalse, vFalse)),
        d.expr(e.and(vTrue, vFalse)),
        d.expr(e.and(vTrue, vTrue)),
      ])
    )
  )

  t.deepEqual(response, [false, false, true])
})

test('or all', async t => {
  const vFalse = e.data(d.bool(false).toDataConstructor())
  const vTrue = e.data(d.bool(true).toDataConstructor())

  const response = await t.context.exampleQuery(undefined,
    e.data(d =>
      d.list([
        d.expr(e.or(vFalse, vFalse)),
        d.expr(e.or(vTrue, vFalse)),
        d.expr(e.or(vTrue, vTrue)),
      ])
    )
  )

  t.deepEqual(response, [false, true, true])
})

// test('equal all', async t => {
//   const response = await t.context.exampleQuery(
//     undefined,
//     build(e =>
//       e.data(d =>
//         d.list(
//           d.expr(e => e.equal(e.string('foo'), e.string('foo'))),
//           d.expr(e => e.equal(e.string('foo'), e.string('bar'))),
//           d.expr(e => e.equal(e.int8(0), e.int8(0))),
//           d.expr(e => e.equal(e.int8(0), e.int8(1))),
//           d.expr(e =>
//             e.equal(
//               e.data(d => d.struct({foo: e.string('foo'), bar: d.int8(0)})),
//               e.data(d => d.struct({foo: e.string('foo'), bar: d.int8(0)}))
//             )
//           ),
//           d.expr(e =>
//             e.equal(
//               e.data(d => d.struct({foo: e.string('foo'), bar: d.int8(0)})),
//               e.data(d => d.struct({foo: e.string('bar'), bar: d.int8(0)}))
//             )
//           )
//         )
//       )
//     )
//   )
//
//   t.deepEqual(response, [true, false, true, false, true, false])
// })

test('if', async t => {
  const response = await t.context.exampleQuery('if_0',
    e.if_(
      e.equal(e.string('foo'), e.string('bar')),
      e.string('foo and bar are equal'),
      e.string('foo and bar are not equal'),
    )
  )
  t.deepEqual(response, 'foo and bar are not equal')
})

test('if all', async t => {
  const vFalse = e.data(d.bool(false).toDataConstructor())
  const vTrue = e.data(d.bool(true).toDataConstructor())

  const response = await t.context.exampleQuery(undefined,
    e.data(d =>
      d.list([
        d.expr(e.if_(vTrue, vTrue, vFalse)),
        d.expr(e.if_(vFalse, vTrue, vFalse)),
      ])
    )
  )

  t.deepEqual(response, [true, false])
})

test('not', async t => {
  const vTrue = e.data(d.bool(true).toDataConstructor())

  const response = await t.context.exampleQuery('not_0',
    e.not(vTrue)
  )

  t.is(response, false)
})

test('switchCase', async t => {
  const response = await t.context.exampleQuery('switchCase_0',
    e.switchCase(e.data(d.union('foo', d.string('bar')).toDataConstructor()), {
      'foo': val => val
    })
  )

  t.is(response, 'bar')
})

test('assertCase', async t => {
  const response = await t.context.exampleQuery('assertCase_0',
    e.assertCase('foo', e.data(d.union('foo', d.string('bar')).toDataConstructor()))
  )
  t.is(response, 'bar')

  const error: any = await t.throwsAsync(async () => {
    await t.context.exampleQuery('assertCase_1',
      e.assertCase('bar', e.data(d.union('foo', d.string('bar')).toDataConstructor()))
    )
  }, Error)

  t.truthy(error)
})

test('assertPresent', async t => {
  const response = await t.context.exampleQuery('assertPresent_0',
    e.assertPresent(e.string('foo'))
  )
  t.is(response, 'foo')

  const error: any = await t.throwsAsync(async () => {
    await t.context.exampleQuery('assertPresent_1',
      e.assertPresent(e.tag("notPresent"))
    )
  }, Error)
  t.truthy(error)
})

test('assertModelRef', async t => {
  const response = await t.context.exampleQuery('assertModelRef_0',
    e.assertModelRef(e.first(e.all(e.tag('_tag'))), e.tag('_tag'))
  )

  t.is(typeof response, 'object')
  t.is(typeof response.tag, 'string')
  t.true(isRef(response.model))

  const error: any = await t.throwsAsync(async () => {
    await t.context.exampleQuery('assertModelRef_1',
      e.assertModelRef(e.tag('_tag'), e.first(e.all(e.tag('_user'))))
    )
  }, Error)

  t.truthy(error)
})

import {
  buildExpression as build,
  KarmaError,
  KarmaErrorType,
  expression as e,
  data as d,
  isRef
} from '@karma.run/sdk'

import test from '../_before'

test('and', async t => {
  const response = await t.context.exampleQuery('and_0', e.and(d.bool(true), d.bool(false)))
  t.deepEqual(response, false)
})

test('or', async t => {
  const response = await t.context.exampleQuery('or_0', e.or(d.bool(true), d.bool(false)))
  t.deepEqual(response, true)
})

test('equal', async t => {
  const response = await t.context.exampleQuery(
    'equal_0',
    e.equal(d.string('foo'), d.string('bar'))
  )

  t.deepEqual(response, false)
})

test('and all', async t => {
  const response = await t.context.exampleQuery(
    undefined,
    build(e =>
      e.data(d =>
        d.list(
          d.expr(e => e.and(e.bool(false), e.bool(false))),
          d.expr(e => e.and(e.bool(true), e.bool(false))),
          d.expr(e => e.and(e.bool(true), e.bool(true)))
        )
      )
    )
  )

  t.deepEqual(response, [false, false, true])
})

test('or all', async t => {
  const response = await t.context.exampleQuery(
    undefined,
    build(e =>
      e.data(d =>
        d.list(
          d.expr(e => e.or(e.bool(false), e.bool(false))),
          d.expr(e => e.or(e.bool(true), e.bool(false))),
          d.expr(e => e.or(e.bool(true), e.bool(true)))
        )
      )
    )
  )

  t.deepEqual(response, [false, true, true])
})

test('equal all', async t => {
  const response = await t.context.exampleQuery(
    undefined,
    build(e =>
      e.data(d =>
        d.list(
          d.expr(e => e.equal(e.string('foo'), e.string('foo'))),
          d.expr(e => e.equal(e.string('foo'), e.string('bar'))),
          d.expr(e => e.equal(e.int8(0), e.int8(0))),
          d.expr(e => e.equal(e.int8(0), e.int8(1))),
          d.expr(e =>
            e.equal(
              e.data(d => d.struct({foo: e.string('foo'), bar: d.int8(0)})),
              e.data(d => d.struct({foo: e.string('foo'), bar: d.int8(0)}))
            )
          ),
          d.expr(e =>
            e.equal(
              e.data(d => d.struct({foo: e.string('foo'), bar: d.int8(0)})),
              e.data(d => d.struct({foo: e.string('bar'), bar: d.int8(0)}))
            )
          )
        )
      )
    )
  )

  t.deepEqual(response, [true, false, true, false, true, false])
})

test('if', async t => {
  const response = await t.context.exampleQuery(
    'if_0',
    e.if(
      e.equal(d.string('foo'), d.string('bar')),
      d.string('foo and bar are equal'),
      d.string('foo and bar are not equal')
    )
  )
  t.deepEqual(response, 'foo and bar are not equal')
})

test('if all', async t => {
  const response = await t.context.exampleQuery(
    undefined,
    build(e =>
      e.data(d =>
        d.list(
          d.expr(e => e.if(e.bool(true), e.bool(true), e.bool(false))),
          d.expr(e => e.if(e.bool(false), e.bool(true), e.bool(false)))
        )
      )
    )
  )

  t.deepEqual(response, [true, false])
})

test('not', async t => {
  const response = await t.context.exampleQuery('not_0', build(e => e.not(e.bool(true))))

  t.is(response, false)
})

test('switchCase', async t => {
  const response = await t.context.exampleQuery(
    'switchCase_0',
    build(e => e.switchCase(e.data(d => d.union('foo', d.string('bar'))), {foo: value => value}))
  )

  t.is(response, 'bar')
})

// TODO
test.skip('switchModelRef', async t => {
  t.fail()
})

test('assertCase', async t => {
  const response = await t.context.exampleQuery(
    'assertCase_0',
    build(e => e.assertCase('foo', e.data(d => d.union('foo', d.string('bar')))))
  )

  t.is(response, 'bar')

  const error: KarmaError = await t.throws(async () => {
    await t.context.exampleQuery(
      'assertCase_1',
      build(e => e.assertCase('bar', e.data(d => d.union('foo', d.string('bar')))))
    )
  }, KarmaError)

  t.is(error.type, KarmaErrorType.CompilationError)
})

test('assertPresent', async t => {
  const response = await t.context.exampleQuery(
    'assertPresent_0',
    build(e => e.assertPresent(e.string('foo')))
  )

  t.is(response, 'foo')

  const error: KarmaError = await t.throws(async () => {
    await t.context.exampleQuery(
      'assertPresent_1',
      build(e => e.assertPresent({null: null} as any))
    )
  }, KarmaError)

  t.is(error.type, KarmaErrorType.CompilationError)
})

test('assertModelRef', async t => {
  const response = await t.context.exampleQuery(
    'assertModelRef_0',
    build(e => e.assertModelRef(e.tag('_tag'), e.first(e.all(e.tag('_tag')))))
  )

  t.is(typeof response, 'object')
  t.is(typeof response.tag, 'string')
  t.true(isRef(response.model))

  const error: KarmaError = await t.throws(async () => {
    await t.context.exampleQuery(
      'assertModelRef_1',
      build(e => e.assertModelRef(e.tag('_tag'), e.first(e.all(e.tag('_user')))))
    )
  }, KarmaError)

  t.is(error.type, KarmaErrorType.ExecutionError)
})

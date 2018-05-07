import { build } from 'karma.run'
import test from '../_before'

test('and', async t => {
  const response = await t.context.exampleQuery('and_0',
    build(e => e.data(
      d => d.list(
        d.expr(e => e.and(e.bool(false), e.bool(false))),
        d.expr(e => e.and(e.bool(true), e.bool(false))),
        d.expr(e => e.and(e.bool(true), e.bool(true)))
      )
    ))
  )

  t.deepEqual(response, [false, false, true])
})

test('or', async t => {
  const response = await t.context.exampleQuery('or_0',
    build(e => e.data(
      d => d.list(
        d.expr(e => e.or(e.bool(false), e.bool(false))),
        d.expr(e => e.or(e.bool(true), e.bool(false))),
        d.expr(e => e.or(e.bool(true), e.bool(true)))
      )
    ))
  )

  t.deepEqual(response, [false, true, true])
})

// TODO
test('arg', async t => {t.fail()})
test('id', async t => {t.fail()})
test('assertCase', async t => {t.fail()})
test('assertModelRef', async t => {t.fail()})
test('assertPresent', async t => {t.fail()})
test('equal', async t => {t.fail()})
test('if', async t => {t.fail()})
test('not', async t => {t.fail()})
test('presentOrZero', async t => {t.fail()})
test('with', async t => {t.fail()})
test('switchCase', async t => {t.fail()})
test('switchModelRef', async t => {t.fail()})

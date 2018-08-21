import {buildExpression as build, expression as e, data as d} from '@karma.run/sdk'
import test from '../_before'

test('joinStrings', async t => {
  const response = await t.context.exampleQuery('joinStrings_0', build(e =>
    e.joinStrings(e.string(','), e.data(d =>
      d.list(
        d.string('foo'),
        d.string('bar'),
        d.string('baz')
      )
    ))
  ))

  t.is(response, 'foo,bar,baz')
})

test('stringToLower', async t => {
  const response = await t.context.exampleQuery('stringToLower_0', build(e =>
    e.stringToLower(e.string('CAPSÜÄÖË'))
  ))

  t.is(response, 'capsüäöë')
})

test('matchRegex', async t => {
  const response = await t.context.exampleQuery('matchRegex_0',
    e.matchRegex('[0-9]{3}', d.string('123'), true, false)
  )
  t.is(response, true)
})

test('searchAllRegex', async t => {
  const response = await t.context.exampleQuery('searchAllRegex_0',
    e.searchAllRegex('[0-9]{3}', d.string('123 qwer 456 asdf 789'), true, false)
  )
  t.deepEqual(response, [0, 9, 18])
})

test('searchRegex', async t => {
  const response = await t.context.exampleQuery('searchRegex_0',
    e.searchRegex('[0-9]{3}', d.string('qwer456asdf789'), true, false)
  )
  t.is(response, 4)
})

test('stringContains', async t => {
  const response = await t.context.exampleQuery('stringContains_0',
    e.stringContains(d.string('foobar'), d.string('oba'))
  )

  t.true(response)
})

test('substringIndex', async t => {
  const response = await t.context.exampleQuery('substringIndex_0',
    e.substringIndex(d.string('foobar'), d.string('oba'))
  )

  t.is(response, 2)
})

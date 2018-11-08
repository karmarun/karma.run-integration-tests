import test from '../_before'
import { xpr as e, val as d } from 'karma-sdk-typescript'

test.skip('joinStrings', async t => {
  // const response = await t.context.exampleQuery('joinStrings_0',
  //   e.joinStrings(e.string(','), e.data(
  //     d.list(
  //       d.string('foo'),
  //       d.string('bar'),
  //       d.string('baz')
  //     ).toDataConstructor()
  //   ))
  // )
  //
  // t.is(response, 'foo,bar,baz')
})

test('stringToLower', async t => {
  const response = await t.context.exampleQuery('stringToLower_0',
    e.stringToLower(e.string('CAPSÜÄÖË'))
  )

  t.is(response, 'capsüäöë')
})

test('matchRegex', async t => {
  const response = await t.context.exampleQuery('matchRegex_0',
    e.matchRegex(e.string('123'), '[0-9]{3}', true, false)
  )
  t.is(response, true)
})

test('searchAllRegex', async t => {
  const response = await t.context.exampleQuery('searchAllRegex_0',
    e.searchAllRegex(e.string('123 qwer 456 asdf 789'), '[0-9]{3}', true, false)
  )
  t.deepEqual(response, [0, 9, 18])
})

test('searchRegex', async t => {
  const response = await t.context.exampleQuery('searchRegex_0',
    e.searchRegex(e.string('qwer456asdf789'), '[0-9]{3}', true, false)
  )
  t.is(response, 4)
})

test.skip('stringContains', async t => {
  // const response = await t.context.exampleQuery('stringContains_0',
  //   e.stringContains(d.string('foobar'), d.string('oba'))
  // )
  //
  // t.true(response)
})

test.skip('substringIndex', async t => {
  // const response = await t.context.exampleQuery('substringIndex_0',
  //   e.substringIndex(d.string('foobar'), d.string('oba'))
  // )
  //
  // t.is(response, 2)
})

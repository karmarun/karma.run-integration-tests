import { buildExpression as build } from '@karma.run/sdk'
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

// TODO
test.skip('matchRegex', async t => {t.fail()})
test.skip('searchAllRegex', async t => {t.fail()})
test.skip('searchRegex', async t => {t.fail()})

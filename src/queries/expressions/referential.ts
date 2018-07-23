// import { buildExpression as build } from '@karma.run/sdk'
import test from '../_before'

// TODO
test.skip('allReferrers', async t => {t.fail()})
test.skip('refTo', async t => {t.fail()})
test.skip('referred', async t => {t.fail()})
test.skip('referrers', async t => {t.fail()})
test.skip('relocateRef', async t => {t.fail()})
test.skip('resolveAllRefs', async t => {t.fail()})
test.skip('resolveRefs', async t => {t.fail()})
test.skip('tag', async t => {t.fail()})
test.skip('tagExists', async t => {t.fail()})
test.skip('graphFlow', async t => {t.fail()})

// import { ExecutionContext } from 'ava'
// import { build } from '@karma.run/sdk'
// import { data as d, expression as e } from '@karma.run/sdk'
// import test, { QueryTestContext } from '../_before'

// async function getFirstTagRef(t: ExecutionContext<QueryTestContext>) {
//   let q = e.refTo(e.first(e.all(e.tag(e.data(d.string('_tag'))))))
//   return await t.context.exampleQuery('refTo_0', q)
// }

// test('tag', async t => {
//   const response = await t.context.exampleQuery('tag_0',
//     e.tag(e.data(d.string('_tag')))
//   )

//   t.true(Array.isArray(response))
//   t.is(response.length, 2)
// })

// test('refTo', async t => {
//   const response = await getFirstTagRef(t)

//   t.regex(response[0], recordIDRegex)
//   t.regex(response[1], recordIDRegex)
// })

// test('ref', async t => {
//   const firstTag = await getFirstTagRef(t)

//   const query = e.data(d.ref(
//     firstTag[0],
//     firstTag[1]
//   ))

//   const response = await t.context.exampleQuery('ref_0', query)

//   t.regex(response[0], recordIDRegex)
//   t.regex(response[1], recordIDRegex)
// })

// test('model', async t => {
//   const firstTag = await getFirstTagRef(t)
//   const q = e.model(e.string(firstTag[0]))
//   const response = await t.context.exampleQuery('model_0', q)

//   t.regex(response[0], recordIDRegex)
//   t.regex(response[1], recordIDRegex)
// })

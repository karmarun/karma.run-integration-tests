import { ExecutionContext } from 'ava'
import { data as d, expression as e, build } from 'karma.run'
import test, { recordIDRegex, QueryTestContext } from '../_before'
// import { writeFile } from 'fs'

async function getFirstTagRef(t: ExecutionContext<QueryTestContext>) {
  let q = e.refTo(e.first(e.all(e.tag(d.data(d.string('_tag'))))))
  return await t.context.exampleQuery('refTo_0', q)
}

test('tag2', async t => {
  // const response = await t.context.exampleQuery('tag_0',
  //   build(e => e.field('blu',
  //     e.data(d =>
  //       d.struct({
  //         bla: d.string('test'),
  //         blu: d.expr(e => e.tag('_tag'))
  //       })
  //     )
  //   ))
  // )

  const response = await t.context.exampleQuery('tag_0',
    e.get(e.tag(d.data(d.string('_migration'))))
  )

  console.log(JSON.stringify(response, null, 2))

  t.true(Array.isArray(response))
  t.is(response.length, 2)
})

test('tag', async t => {
  const response = await t.context.exampleQuery('tag_0',
    e.tag(d.data(d.string('_tag')))
  )

  t.true(Array.isArray(response))
  t.is(response.length, 2)
})

test('refTo', async t => {
  const response = await getFirstTagRef(t)

  t.regex(response[0], recordIDRegex)
  t.regex(response[1], recordIDRegex)
})

test('ref', async t => {
  const firstTag = await getFirstTagRef(t)

  const query = d.data(e.ref(
    firstTag[0],
    firstTag[1]
  ))

  const response = await t.context.exampleQuery('ref_0', query)

  t.regex(response[0], recordIDRegex)
  t.regex(response[1], recordIDRegex)
})

test('model', async t => {
  const firstTag = await getFirstTagRef(t)
  const q = d.model(d.data(d.string(firstTag[0])))
  const response = await t.context.exampleQuery('model_0', q)

  t.regex(response[0], recordIDRegex)
  t.regex(response[1], recordIDRegex)
})

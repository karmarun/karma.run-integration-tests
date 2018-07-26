import {expression as e, data as d, buildExpression as build} from '@karma.run/sdk'
import test from '../_before'

// TODO
test.skip('allReferrers', async t => {
  t.fail()
})
test.skip('relocateRef', async t => {
  t.fail()
})
test.skip('tagExists', async t => {
  t.fail()
})


test('tag', async t => {
  const response = await t.context.exampleQuery('tag_0',
    e.tag(e.data(d.string('_tag')))
  )
  t.true(Array.isArray(response))
  t.is(response.length, 2)
})

test('refTo', async t => {
  const response = await t.context.exampleQuery('refTo_0',
    e.refTo(e.first(e.all(e.tag('_tag'))))
  )
  t.truthy(response[0])
  t.truthy(response[1])
})

test('ref', async t => {
  let response = await t.context.exampleQuery(undefined,
    e.metarialize(e.first(e.all(e.tag('_tag'))))
  )
  response = await t.context.exampleQuery('ref_0',
    e.data(d.ref(response.id[0], response.id[1]))
  )

  t.truthy(response[0])
  t.truthy(response[1])
})

test('model', async t => {
  const tagResponse = await t.context.query(build(e =>
    e.tag('_tag')
  ))

  const response = await t.context.exampleQuery('model_0', build(e =>
    e.model(e.string(tagResponse[1]))
  ))

  t.deepEqual(response, tagResponse)
})

test('referrers', async t => {
  let response = await t.context.exampleQuery('referrers_0',
    e.referrers(
      e.refTo(e.first(e.all(e.tag('_role')))),
      e.tag('_user')
    )
  )
  t.truthy(response[0][0])
  t.truthy(response[0][1])
})

test('referred', async t => {
  let response = await t.context.exampleQuery('referred_0',
    e.referred(
      e.refTo(e.first(e.all(e.tag('_user')))),
      e.tag('_role')
    )
  )
  t.truthy(response[0][0])
  t.truthy(response[0][1])
})


test('resolveAllRefs', async t => {
  let response = await t.context.exampleQuery('resolveAllRefs_0',
    e.resolveAllRefs(
      e.resolveAllRefs(
        e.first(e.all(e.tag('_user')))
      )
    )
  )
  t.deepEqual(response, {
      "password": "",
      "roles": [{
        "name": "admins",
        "permissions": {
          "create": {"function": [["_"], [{"data": {"bool": true}}]]},
          "delete": {"function": [["_"], [{"data": {"bool": true}}]]},
          "read": {"function": [["_"], [{"data": {"bool": true}}]]},
          "update": {"function": [["_"], [{"data": {"bool": true}}]]}
        }
      }],
      "username": "admin"
    }
  )
})

test.skip('resolveRefs', async t => {
  // let response = await t.context.exampleQuery('resolveRefs_0',
  //   "resolveRefs", {
  //     "value": [
  //       "first", [
  //         "all", [
  //           "tag", ["string", "_user"]
  //         ]
  //       ]
  //     ],
  //     "models": [
  //       [
  //         "tag", ["string", "_role"]
  //       ]
  //     ]
  //   }
  // )
  // t.truthy(response[0][0])
  // t.truthy(response[0][1])
  t.fail()
})

test.skip('graphFlow', async t => {
  // let response = await t.context.exampleQuery('resolveAllRefs_0',
  //   e.graphFlow(
  //     e.refTo(e.first(e.all(e.tag('_role')))),
  //     [
  //       {
  //         from: e.tag('_role'),
  //         backward: [e.tag('_user')],
  //         forward: [e.tag('_expression')]
  //       }
  //     ]
  //   )
  // )

  t.fail()
})

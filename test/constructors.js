import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')
const recordIdRegex = /^[\S]{10,}$/
const m = require('./tools/_model.js')
const e = require('./tools/_expressions.js')
const d = require('./tools/_data.js')

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const karmaApi = new KarmaApi(KARMA_ENDPOINT)
let testRef = null

test.before(async t => {
  await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
  await karmaApi.instanceAdministratorRequest('admin/reset')
  await karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
})

test('tag', async t => {
  const response = await karmaApi.tQuery(t, 'tag_0',
    e.tag(d.data(d.string("_tag")))
  )
  t.is(response.status, 200, karmaApi.printError(response))
})

test('bool', async t => {
  const response = await karmaApi.tQuery(t, 'bool_0',
    d.data(d.bool(true))
  )
  //console.log(response.body.humanReadableError.human)
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, true)
})

test('int8', async t => {
  const response = await karmaApi.tQuery(t, 'int8_0',
    d.data(d.int8(127))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 127)
})

test('int16', async t => {
  let response = await karmaApi.tQuery(t, 'int16_0',
    d.data(d.int16(32767))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 32767)
})

test('int32', async t => {
  let response = await karmaApi.tQuery(t, 'int32_0',
    d.data(d.int32(2147483647)))
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 2147483647)
})

test('int64', async t => {
  let response = await karmaApi.tQuery(t, 'int64_0',
    d.data(d.uint64(922337203685477))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 922337203685477)
})

test('uint8', async t => {
  const response = await karmaApi.tQuery(t, 'uint8_0',
    d.data(d.uint8(255))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 255)
})

test('uint16', async t => {
  let response = await karmaApi.tQuery(t, 'uint16_0',
    d.data(d.uint16(65535))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 65535)
})

test('uint32', async t => {
  let response = await karmaApi.tQuery(t, 'uint32_0',
    d.data(d.uint32(4294967295))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 4294967295)
})

test('uint64', async t => {
  let response = await karmaApi.tQuery(t, 'uint64_0',
    d.data(d.uint64(1844674407370955))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 1844674407370955)
})

test('float', async t => {
  const response = await karmaApi.tQuery(t, 'float_0',
    d.data(d.float(-0.00099999))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, -0.00099999)
})

test('dateTime', async t => {
  const response = await karmaApi.tQuery(t, 'dateTime_0',
    d.data(d.dateTime("2017-01-01T00:00:00Z"))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, '2017-01-01T00:00:00Z')
})

test('string', async t => {
  const response = await karmaApi.tQuery(t, 'string_0',
    d.data(d.string("àèöäü😀🐱"))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.is(response.body, 'àèöäü😀🐱')
})

test('list', async t => {
  const response = await karmaApi.tQuery(t, 'list_0',
    d.data(d.list(d.int8(1), d.int8(2), d.int8(3)))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.deepEqual(response.body, [1, 2, 3])
})

test('tuple', async t => {
  const response = await karmaApi.tQuery(t, 'tuple_0',
    d.data(d.tuple(
      d.string("foo"),
      d.int8(127)
    ))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.deepEqual(response.body, ["foo", 127])
})

test('map', async t => {
  const response = await karmaApi.tQuery(t, 'map_0',
    d.data(d.map({
      "foo": d.int8(1),
      "bar": d.int8(4)
    }))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.deepEqual(response.body, {"foo": 1, "bar": 4})
})

test('set', async t => {
  const response = await karmaApi.tQuery(t, 'set_0',
    d.data(d.set(
      d.int8(4),
      d.int8(4)
      )
    )
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.deepEqual(response.body, [4])
})

test('struct', async t => {
  const response = await karmaApi.tQuery(t, 'struct_0',
    d.data(d.struct({
      "myInt": d.int8(-127),
      "myFloat": d.float(-0.00099999)
    }))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.deepEqual(response.body, {
    "myInt": -127,
    "myFloat": -0.00099999
  })
})

test('union', async t => {
  const response = await karmaApi.tQuery(t, 'union_0',
    d.data(d.union(
      "foo", d.int8(-127),
    ))
  )
  t.is(response.status, 200, karmaApi.printError(response))
  t.deepEqual(response.body, {"foo": -127})
})

test.serial('refTo', async t => {
  let q = e.refTo(e.first(e.all(e.tag(d.data(d.string("_tag"))))))
  const response = await karmaApi.tQuery(t, 'refTo_0', q)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
  testRef = response.body
})

// test.serial('ref', async t => {
//   const query = [
//     "ref", [
//       ["tag", ["string", "_tag"]],
//       ["string", testRef[1]]
//     ]
//   ]
//
//   const q = d.data(e.ref([
//     testRef[0],
//     testRef[1]
//   ]))
//
//   const q = d.data(e.ref([
//     d.expr(e.tag(d.string("_tag"))),
//     d.string(testRef[1])
//   ]))
//
//   const response = await karmaApi.tQuery(t, 'ref_0', q)
//   t.is(response.status, 200, karmaApi.printError(response))
//   console.log(response.body[1].human)
//   t.regex(response.body[0], recordIdRegex)
//   t.regex(response.body[1], recordIdRegex)
// })

test.serial('model', async t => {
  const q = d.model(d.data(d.string(testRef[0])))
  const response = await karmaApi.tQuery(t, 'model_0', q)
  t.is(response.status, 200, karmaApi.printError(response))
  t.regex(response.body[0], recordIdRegex)
  t.regex(response.body[1], recordIdRegex)
})

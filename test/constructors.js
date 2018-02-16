import test from 'ava'
import {should, expect} from 'chai'

require('dotenv').config()
const {KarmaApi} = require('./tools/_karmaApi.js')

const DB_NAME = 'db-api-test-constructors'
const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const karmaApi = new KarmaApi(KARMA_ENDPOINT)


test.before(async t => {
  await karmaApi.instanceAdministratorRequest('/admin/reset', 'POST', KARMA_INSTANCE_SECRET, '')
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
})

test('tag', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "tag", ["string", "_tag"]
    ])
  t.is(response.status, 200)
  //t.regex(response.body, /^[a-zA-Z]{10,40}$/)
})

test('bool', async t => {
  const response = await karmaApi.tQuery(t, [
    "bool", true
  ])
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('int8', async t => {
  const response = await karmaApi.tQuery(t, [
    "int8", 127
  ])
  t.is(response.status, 200)
  t.is(response.body, 127)
})

test('int16', async t => {
  let response = await karmaApi.tQuery(t, [
    "int16", 32767
  ])
  t.is(response.status, 200)
  t.is(response.body, 32767)
})

test('int32', async t => {
  let response = await karmaApi.tQuery(t, [
    "int32", 2147483647
  ])
  t.is(response.status, 200)
  t.is(response.body, 2147483647)
})

test('int64', async t => {
  let response = await karmaApi.tQuery(t, [
    "int64", 922337203685477
  ])
  t.is(response.status, 200)
  t.is(response.body, 922337203685477)
})

test('uint8', async t => {
  const response = await karmaApi.tQuery(t, [
    "uint8", 255
  ])
  t.is(response.status, 200)
  t.is(response.body, 255)
})

test('uint16', async t => {
  let response = await karmaApi.tQuery(t, [
    "uint16", 65535
  ])
  t.is(response.status, 200)
  t.is(response.body, 65535)
})

test('uint32', async t => {
  let response = await karmaApi.tQuery(t, [
    "uint32", 4294967295
  ])
  t.is(response.status, 200)
  t.is(response.body, 4294967295)
})

test('uint64', async t => {
  let response = await karmaApi.tQuery(t, [
    "uint64", 1844674407370955
  ])
  t.is(response.status, 200)
  t.is(response.body, 1844674407370955)
})

test('float', async t => {
  const response = await karmaApi.tQuery(t, [
    "float", -0.00099999
  ])
  t.is(response.status, 200)
  t.is(response.body, -0.00099999)
})

// test('dateTime', async t => {
//   const response = await karmaApi.tQuery(t, [
//     "dateTime", "2017-01-01T00:00:00Z"
//   ])
//   t.is(response.status, 200)
//   t.is(response.body, '2017-01-01T00:00:00Z')
// })

test('string', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "string", "àèöäü😀🐱"
    ])
  t.is(response.status, 200)
  t.is(response.body, 'àèöäü😀🐱')
})

test('list', async t => {
  const response = await karmaApi.tQuery(t,
    [
      "list", [["int8", 1], ["int8", 2], ["int8", 3]]
    ])
  t.is(response.status, 200)
  t.deepEqual(response.body, [1, 2, 3])
})

test('tuple', async t => {
  const response = await karmaApi.tQuery(t,
    ["tuple", [
      ["string", "foo"],
      ["int8", 127]
    ]])
  t.is(response.status, 200)
  t.deepEqual(response.body, ["foo", 127])
})

test('map', async t => {
  const response = await karmaApi.tQuery(t,
    ["map", {
      "foo": ["int8", 1],
      "bar": ["int8", 4]
    }])
  t.is(response.status, 200)
  //console.log(response.body[1].human)
  t.deepEqual(response.body, {"foo": 1, "bar": 4})
})

test('set', async t => {
  const response = await karmaApi.tQuery(t,
    ["set", [
      ["int8", 4],
      ["int8", 4]
    ]])
  t.is(response.status, 200)
  t.deepEqual(response.body, [4])
})

test('struct', async t => {
  const response = await karmaApi.tQuery(t,
    ["struct", {
      "myInt": ["int8", -127],
      "myFloat": ["float", -0.00099999]
    }])
  t.is(response.status, 200)
  t.deepEqual(response.body, {
    "myInt": -127,
    "myFloat": -0.00099999
  })
})

test('union', async t => {
  const response = await karmaApi.tQuery(t,
    ["union", [
      "foo", ["int8", -127],
    ]])
  t.is(response.status, 200)
  t.deepEqual(response.body, ["foo", -127])
})

// test('ref', async t => {
//   const response = await karmaApi.tQuery(t,
//     ["ref", [
//       4,
//     ]])
//   t.is(response.status, 200)
//   t.deepEqual(response.body, ["foo", -127])
// })

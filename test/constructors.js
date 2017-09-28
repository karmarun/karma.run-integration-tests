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
  await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.instanceAdministratorRequest('/root/create_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  await karmaApi.signIn(DB_NAME, 'admin', KARMA_INSTANCE_SECRET)
})

test.after(async t => {
  const response = await karmaApi.instanceAdministratorRequest('/root/delete_db', 'POST', KARMA_INSTANCE_SECRET, DB_NAME)
  t.is(response.status, 200)
})

test('tag', async t => {
  const response = await karmaApi.tQuery(t, {
    "tag": "_tag"
  })
  t.is(response.status, 200)
  t.regex(response.body, /^[a-zA-Z]{10,40}$/)
})

test('newBool', async t => {
  const response = await karmaApi.tQuery(t, {
    "newBool": true
  })
  t.is(response.status, 200)
  t.is(response.body, true)
})

test('newInt', async t => {
  const response = await karmaApi.tQuery(t, {
    "newInt": Number.MIN_SAFE_INTEGER
  })
  t.is(response.status, 200)
  t.is(response.body, Number.MIN_SAFE_INTEGER)
})

test('newFloat', async t => {
  const response = await karmaApi.tQuery(t, {
    "newFloat": -0.00099999
  })
  t.is(response.status, 200)
  t.is(response.body, -0.00099999)
})

test('newDateTime', async t => {
  const response = await karmaApi.tQuery(t, {
    "newDateTime": "2017-01-01T00:00:00Z"
  })
  t.is(response.status, 200)
  t.is(response.body, '2017-01-01T00:00:00Z')
})

test('newString', async t => {
  const response = await karmaApi.tQuery(t, {
    "newString": "àèöäü😀🐱"
  })
  t.is(response.status, 200)
  t.is(response.body, 'àèöäü😀🐱')
})

test('newList', async t => {
  const response = await karmaApi.tQuery(t, {
    "newList": [1, 2, 3]
  })
  t.is(response.status, 200)
  t.deepEqual(response.body, [1, 2, 3])
})

test('newTuple', async t => {
  const response = await karmaApi.tQuery(t, {
    "newTuple": ["foo", 123]
  })
  t.is(response.status, 200)
  t.deepEqual(response.body, ["foo", 123])
})

test('newMap', async t => {
  const response = await karmaApi.tQuery(t, {
    "newMap": {"foo": 1, "bar": 4}
  })
  t.is(response.status, 200)
  t.deepEqual(response.body, {"foo": 1, "bar": 4})
})

test('newStruct', async t => {
  const response = await karmaApi.tQuery(t, {
    "newStruct": {
      "myInt": Number.MAX_SAFE_INTEGER,
      "myFloat": -0.00099999,
    }
  })
  t.is(response.status, 200)
  t.deepEqual(response.body, {
    "myInt": Number.MAX_SAFE_INTEGER,
    "myFloat": -0.00099999
  })
})

test('newUnion', async t => {
  const response = await karmaApi.tQuery(t, {
    "newUnion": {"foo": 4}
  })
  t.is(response.status, 200)
  t.deepEqual(response.body, {"foo": 4})
})

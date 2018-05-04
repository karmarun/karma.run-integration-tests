import { expression as d } from 'karma.run'
import test from '../_before'

test('bool', async t => {
  const response = await t.context.exampleQuery('bool_0',
    d.data(d.bool(true))
  )

  t.is(response, true)
})

test('int8', async t => {
  const response = await t.context.exampleQuery('int8_0',
    d.data(d.int8(127))
  )

  t.is(response, 127)
})

test('int16', async t => {
  let response = await t.context.exampleQuery('int16_0',
    d.data(d.int16(32767))
  )

  t.is(response, 32767)
})

test('int32', async t => {
  let response = await t.context.exampleQuery('int32_0',
    d.data(d.int32(2147483647))
  )

  t.is(response, 2147483647)
})

test('int64', async t => {
  let response = await t.context.exampleQuery('int64_0',
    d.data(d.uint64(922337203685477))
  )

  t.is(response, 922337203685477)
})

test('uint8', async t => {
  const response = await t.context.exampleQuery('uint8_0',
    d.data(d.uint8(255))
  )

  t.is(response, 255)
})

test('uint16', async t => {
  let response = await t.context.exampleQuery('uint16_0',
    d.data(d.uint16(65535))
  )

  t.is(response, 65535)
})

test('uint32', async t => {
  let response = await t.context.exampleQuery('uint32_0',
    d.data(d.uint32(4294967295))
  )

  t.is(response, 4294967295)
})

test('uint64', async t => {
  let response = await t.context.exampleQuery('uint64_0',
    d.data(d.uint64(1844674407370955))
  )

  t.is(response, 1844674407370955)
})

test('float', async t => {
  const response = await t.context.exampleQuery('float_0',
    d.data(d.float(-0.00099999))
  )
  t.is(response, -0.00099999)
})

test('dateTime', async t => {
  const response = await t.context.exampleQuery('dateTime_0',
    d.data(d.dateTime('2017-01-01T00:00:00Z'))
  )

  t.is(response, '2017-01-01T00:00:00Z')
})

test('string', async t => {
  const response = await t.context.exampleQuery('string_0',
    d.data(d.string('àèöäü😀🐱'))
  )

  t.is(response, 'àèöäü😀🐱')
})

test('list', async t => {
  const response = await t.context.exampleQuery('list_0',
    d.data(d.list(d.int8(1), d.int8(2), d.int8(3)))
  )

  t.deepEqual(response, [1, 2, 3])
})

test('tuple', async t => {
  const response = await t.context.exampleQuery('tuple_0',
    d.data(d.tuple(
      d.string('foo'),
      d.int8(127)
    ))
  )

  t.deepEqual(response, ['foo', 127])
})

test('map', async t => {
  const response = await t.context.exampleQuery('map_0',
    d.data(d.map({
      'foo': d.int8(1),
      'bar': d.int8(4)
    }))
  )

  t.deepEqual(response, {'foo': 1, 'bar': 4})
})

test('set', async t => {
  const response = await t.context.exampleQuery('set_0',
    d.data(d.set(
      d.int8(4),
      d.int8(4)
      )
    )
  )

  t.deepEqual(response, [4])
})

test('struct', async t => {
  const response = await t.context.exampleQuery('struct_0',
    d.data(d.struct({
      'myInt': d.int8(-127),
      'myFloat': d.float(-0.00099999)
    }))
  )

  t.deepEqual(response, {
    'myInt': -127,
    'myFloat': -0.00099999
  })
})

test('union', async t => {
  const response = await t.context.exampleQuery('union_0',
    d.data(d.union(
      'foo', d.int8(-127),
    ))
  )

  t.deepEqual(response, {'foo': -127})
})


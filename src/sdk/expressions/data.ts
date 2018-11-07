import test from '../_before'
import { xpr as e, val as d } from 'karma-sdk-typescript'

test('bool', async t => {
  const response = await t.context.exampleQuery('bool_1',
    e.data(d.bool(true).toDataConstructor())
  )
  t.is(response, true)
})

test('int8', async t => {
  const response = await t.context.exampleQuery('int8_1',
    e.data(d.int8(127).toDataConstructor())
  )

  t.is(response, 127)
})

test('int16', async t => {
  let response = await t.context.exampleQuery('int16_1',
    e.data(d.int16(32_767).toDataConstructor())
  )

  t.is(response, 32_767)
})

test('int32', async t => {
  let response = await t.context.exampleQuery('int32_1',
    e.data(d.int32(2_147_483_647).toDataConstructor())
  )

  t.is(response, 2_147_483_647)
})

test('int64', async t => {
  let response = await t.context.exampleQuery('int64_1',
    e.data(d.int64(Number.MAX_SAFE_INTEGER).toDataConstructor())
  )

  t.is(response, Number.MAX_SAFE_INTEGER)
})

test('uint8', async t => {
  const response = await t.context.exampleQuery('uint8_1',
    e.data(d.uint8(255).toDataConstructor())
  )

  t.is(response, 255)
})

test('uint16', async t => {
  let response = await t.context.exampleQuery('uint16_1',
    e.data(d.uint16(65_535).toDataConstructor())
  )

  t.is(response, 65_535)
})

test('uint32', async t => {
  let response = await t.context.exampleQuery('uint32_1',
    e.data(d.uint32(4_294_967_295).toDataConstructor())
  )

  t.is(response, 4_294_967_295)
})

test('uint64', async t => {
  let response = await t.context.exampleQuery('uint64_1',
    e.data(d.uint64(1_844_674_407_370_955).toDataConstructor())
  )

  t.is(response, 1_844_674_407_370_955)
})

test('float', async t => {
  const response = await t.context.exampleQuery('float_1',
    e.data(d.float(-0.00099999).toDataConstructor())
  )

  t.is(response, -0.00099999)
})

test('dateTime', async t => {
  const response = await t.context.exampleQuery('dateTime_1',
    e.data(d.dateTime(new Date('2017-01-01T00:00:00Z')).toDataConstructor())
  )

  t.is(response, '2017-01-01T00:00:00Z')
})

test('string', async t => {
  const response = await t.context.exampleQuery('string_1',
    e.data(d.string('àèöäü😀🐱').toDataConstructor())
  )

  t.is(response, 'àèöäü😀🐱')
})

test('list', async t => {
  const response = await t.context.exampleQuery('list_1',
    e.data(
      d.list([
        d.int8(1), d.int8(2), d.int8(3)
      ]).toDataConstructor()
    )
  )

  t.deepEqual(response, [1, 2, 3])
})

test('tuple', async t => {
  const response = await t.context.exampleQuery('tuple_1',
    e.data(
      d.tuple(
        d.string("foo"), d.int8(127)
      ).toDataConstructor()
    )
  )

  t.deepEqual(response, ['foo', 127])
})

test('map', async t => {
  const response = await t.context.exampleQuery('map_1',
    e.data(
      d.map(
        {
          foo: d.int8(1),
          bar: d.int8(4),
        }
      ).toDataConstructor()
    )
  )

  t.deepEqual(response, {'foo': 1, 'bar': 4})
})

test('set', async t => {
  const response = await t.context.exampleQuery('set_1',
    e.data(
      d.set(
        [d.int8(4),
          d.int8(4),
        ]
      ).toDataConstructor()
    )
  )

  t.deepEqual(response, [4])
})

test('struct', async t => {
  const response = await t.context.exampleQuery('struct_1',
    e.data(
      d.struct(
        {
          myInt: d.int8(-127),
          myFloat: d.float(-0.00099999),
        }
      ).toDataConstructor()
    )
  )

  t.deepEqual(response, {
    'myInt': -127,
    'myFloat': -0.00099999
  })
})

test('union', async t => {
  const response = await t.context.exampleQuery('union_1',
    e.data(
      d.union(
        "foo",
        d.int8(-127)
      ).toDataConstructor()
    )
  )
  t.deepEqual(response, {'foo': -127})
})

test.skip('null', async t => {
  const response = await t.context.exampleQuery('null_1',
    //e.data(null)
  )

  t.deepEqual(response, null)
})

// test('unique', async t => {
//   try {
//     await t.context.exampleQuery('unique_1',
//       e.createMultiple(e.tag(d.string("_user")), {
//         a: f.function(["refs"], e.data(d.struct({
//           username: d.string("test-user"),
//           password: d.string("$2a$04$0grY4cHFfy330bCokWYDJ.9CvTG5gqEeOGlNnbGxZDkVYThCC8eOS"),
//           roles: d.list(d.expr(e.refTo(e.first(e.all(e.tag(d.string("_role"))))))),
//         }))),
//         b: f.function(["refs"], e.data(d.struct({
//           username: d.string("test-user"),
//           password: d.string("$2a$04$0grY4cHFfy330bCokWYDJ.9CvTG5gqEeOGlNnbGxZDkVYThCC8eOS"),
//           roles: d.list(d.expr(e.refTo(e.first(e.all(e.tag(d.string("_role"))))))),
//         })))
//       })
//     )
//   } catch (e) {
//     t.deepEqual(e.data, {problem: 'unique constraint violation'})
//   }
// })
//
test('optional', async t => {
  const response = await t.context.exampleQuery('optional_1',
    e.data(
      d.struct({
        myString: d.string('foo'),
        myOptionalString: d.string('bar')
      }).toDataConstructor()
    )
  )
  t.deepEqual(response, {"myOptionalString": "bar", "myString": "foo"})
})

test('optional omitting optional', async t => {
  const response = await t.context.exampleQuery('optional_2',
    e.data(
      d.struct({
        myString: d.string('foo'),
      }).toDataConstructor()
    )
  )
  t.deepEqual(response, {"myString": "foo"})
})

test('recursive', async t => {
  const response = await t.context.exampleQuery('recursive_1',
    e.data(d.struct({
        foo: d.struct({
          bar: d.int32(1),
          zap: d.struct({
            foo: d.struct({
              bar: d.int32(2),
              zap: d.struct({
                foo: d.struct({
                  bar: d.int32(3),
                }),
                bar: d.int32(3),
              }),
            }),
            bar: d.int32(2),
          }),
        }),
        bar: d.int32(1),
      }).toDataConstructor()
    )
  )

  t.deepEqual(response, {
    "bar": 1,
    "foo": {"bar": 1, "zap": {"bar": 2, "foo": {"bar": 2, "zap": {"bar": 3, "foo": {"bar": 3}}}}}
  })
})

test('recursion', async t => {
  const response = await t.context.exampleQuery('recursion_1',
    e.data(
      d.struct({
        payload: d.int32(1),
        next: d.struct({
          payload: d.int32(2),
          next: d.struct({
            payload: d.int32(3),
          }),
        })
      }).toDataConstructor()
    )
  )

  t.deepEqual(response, {"next": {"next": {"payload": 3}, "payload": 2}, "payload": 1})
})
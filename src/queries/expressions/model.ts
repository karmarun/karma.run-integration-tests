import {model as m, expression as e} from '@karma.run/sdk'
import test from '../_before'

test('bool', async t => {
  const response = await t.context.exampleQuery('bool_0',
    e.data(m.bool())
  )
  t.deepEqual(response, {"bool": {}})
})

test('int8', async t => {
  const response = await t.context.exampleQuery('int8_0',
    e.data(m.int8())
  )
  t.deepEqual(response, {"int8": {}})
})

test('int16', async t => {
  let response = await t.context.exampleQuery('int16_0',
    e.data(m.int16())
  )
  t.deepEqual(response, {"int16": {}})
})

test('int32', async t => {
  let response = await t.context.exampleQuery('int32_0',
    e.data(m.int32())
  )
  t.deepEqual(response, {"int32": {}})
})

test('int64', async t => {
  let response = await t.context.exampleQuery('int64_0',
    e.data(m.int64())
  )
  t.deepEqual(response, {"int64": {}})
})

test('uint8', async t => {
  const response = await t.context.exampleQuery('uint8_0',
    e.data(m.uint8())
  )
  t.deepEqual(response, {"uint8": {}})
})

test('uint16', async t => {
  let response = await t.context.exampleQuery('uint16_0',
    e.data(m.uint16())
  )
  t.deepEqual(response, {"uint16": {}})
})

test('uint32', async t => {
  let response = await t.context.exampleQuery('uint32_0',
    e.data(m.uint32())
  )
  t.deepEqual(response, {"uint32": {}})
})

test('uint64', async t => {
  let response = await t.context.exampleQuery('uint64_0',
    e.data(m.uint64())
  )
  t.deepEqual(response, {"uint64": {}})
})

test('float', async t => {
  const response = await t.context.exampleQuery('float_0',
    e.data(m.float())
  )
  t.deepEqual(response, {"float": {}})
})

test('dateTime', async t => {
  const response = await t.context.exampleQuery('dateTime_0',
    e.data(m.dateTime())
  )
  t.deepEqual(response, {"dateTime": {}})
})

test('string', async t => {
  const response = await t.context.exampleQuery('string_0',
    e.data(m.string())
  )
  t.deepEqual(response, {"string": {}})
})

test('list', async t => {
  const response = await t.context.exampleQuery('list_0',
    e.data(m.list(m.int8()))
  )
  t.deepEqual(response, {"list": {"int8": {}}})
})

test('tuple', async t => {
  const response = await t.context.exampleQuery('tuple_0',
    e.data(m.tuple(
      m.string(),
      m.int8()
    ))
  )
  t.deepEqual(response, {"tuple": [{"string": {}}, {"int8": {}}]})
})

test('map', async t => {
  const response = await t.context.exampleQuery('map_0',
    e.data(m.map(m.struct(
      {
        foo: m.int8(),
        bar: m.int8()
      }
    )))
  )
  t.deepEqual(response, {"map": {"struct": {"bar": {"int8": {}}, "foo": {"int8": {}}}}})
})

test('set', async t => {
  const response = await t.context.exampleQuery('set_0',
    e.data(m.set(m.int8()))
  )
  t.deepEqual(response, {"set": {"int8": {}}})
})

test('struct', async t => {
  const response = await t.context.exampleQuery('struct_0',
    e.data(m.struct({
      myInt: m.int8(),
      myFloat: m.float()
    }))
  )
  t.deepEqual(response, {"struct": {"myFloat": {"float": {}}, "myInt": {"int8": {}}}})
})

test('union', async t => {
  const response = await t.context.exampleQuery('union_0',
    e.data(m.union({
      foo: m.int8(),
      bar: m.string()
    }))
  )
  t.deepEqual(response, {"union": {"bar": {"string": {}}, "foo": {"int8": {}}}})
})

test('unique', async t => {
  const response = await t.context.exampleQuery('unique_0',
    e.data(m.unique(m.struct({
      foo: m.string(),
      bar: m.string()
    })))
  )
  t.deepEqual(response, {"unique": {"struct": {"bar": {"string": {}}, "foo": {"string": {}}}}})
})

test('optional', async t => {
  const response = await t.context.exampleQuery('optional_0',
    e.data(m.struct({
      myString: m.string(),
      myOptionalString: m.optional(m.string())
    }))
  )
  t.deepEqual(response, {"struct": {"myOptionalString": {"optional": {"string": {}}}, "myString": {"string": {}}}})
})

test('recursive', async t => {
  const response = await t.context.exampleQuery('recursive_0',
    e.data(
      m.recursive('S',
        {
          'S': m.struct({
            'foo': m.recurse('T'),
            'bar': m.recurse('U')
          }),
          'T': m.struct({
            'bar': m.recurse('U'),
            'zap': m.optional(
              m.recurse('S')
            )
          }),
          'U': m.int32()
        }
      )
    )
  )
  t.deepEqual(response, {
    "recursive": {
      "models": {
        "S": {"struct": {"bar": {"recurse": "U"}, "foo": {"recurse": "T"}}},
        "T": {"struct": {"bar": {"recurse": "U"}, "zap": {"optional": {"recurse": "S"}}}},
        "U": {"int32": {}}
      }, "top": "S"
    }
  })
})

test('recursive error', async t => {
  const response = await t.context.exampleQuery('recursive_2',
    e.data(
      m.recursive('A',
        {
          'A': m.recurse('B'),
          'B': m.recurse('A')
        }
      )
    )
  )
  t.deepEqual(response, {"recursive": {"models": {"A": {"recurse": "B"}, "B": {"recurse": "A"}}, "top": "A"}})
})

test('recursion', async t => {
  const response = await t.context.exampleQuery('recursion_0',
    e.data(m.recursion("self", m.struct({
      payload: m.int32(),
      next: m.optional(m.recurse("self")),
    })))
  )
  t.deepEqual(response, {
    "recursion": {
      "label": "self",
      "model": {"struct": {"next": {"optional": {"recurse": "self"}}, "payload": {"int32": {}}}}
    }
  })
})

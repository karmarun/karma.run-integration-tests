import test from '../../utils/_before'

import * as e from '@karma.run/sdk/expression'
import * as m from '@karma.run/sdk/model'
import * as d from '@karma.run/sdk/value'
import * as utl from '@karma.run/sdk/utility'

import { isRef } from '../../utils/_utility'

test('key', async t => {
  const response = await t.context.exampleQuery('key_0',
    e.key('a', e.data(d.map({
      a: d.int8(1),
      b: d.int8(2),
      c: d.int8(3)
    }).toDataConstructor())
    )
  )

  t.is(response, 1)
})

test('mapMap', async t => {
  const response = await t.context.exampleQuery('mapMap_0',
    e.mapMap(
      e.data(d.map({
        a: d.int8(1),
        b: d.int8(2),
        c: d.int8(3)
      }
      ).toDataConstructor()),
      (_, value) => e.addInt8(value, e.data(d.int8(1).toDataConstructor()))
    )
  )

  t.deepEqual(response, {
    a: 2,
    b: 3,
    c: 4
  })
})

test('setKey', async t => {
  const response = await t.context.exampleQuery('setKey_0',
    e.setKey('d', e.int8(4), e.data(
      d.map({
        a: d.int8(1),
        b: d.int8(2),
        c: d.int8(3)
      }).toDataConstructor()
    )
    )
  )

  t.deepEqual(response, {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  })
})



test.failing('createEmpty', async t => {

  const model = m.struct({
    myMap: m.map(m.struct({
      a: m.string
    })),
  })

  const modelRef = await t.context.exampleQuery(undefined,
    utl.createModelsAndTags({
      model
    })
  )
  t.true(modelRef && isRef(modelRef.model))

  const createMultiple = e.createMultiple(
    e.tag('model'),
    {
      exampleA: refs => {
        return e.data(d.struct({
          myMap: d.map({
            a: d.struct({
              a: d.string('a')
            })
          }),
        }).toDataConstructor())
      },
      exampleB: refs => {
        return e.data(d.struct({
          myMap: d.map({}),
        }).toDataConstructor())
      },
      exampleC: refs => {
        return e.data(model.decode(
          {
            myMap: {},
          }
        ).toDataConstructor())
      },
    }
  )

  const result = await t.context.exampleQuery(undefined, createMultiple)
  t.true(result && isRef(result.exampleA))
})
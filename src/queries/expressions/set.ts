import test from '../../utils/_before'

import * as e from '@karma.run/sdk/expression'
import * as m from '@karma.run/sdk/model'
import * as d from '@karma.run/sdk/value'
import * as utl from '@karma.run/sdk/utility'

import { isRef } from '../../utils/_utility'

test('mapSet', async t => {
  const response = await t.context.exampleQuery('mapSet_0',
    e.mapSet(
      e.data(d.set([
        d.string('_tag'),
        d.string('_tag'),
        d.string('_user'),
      ]).toDataConstructor()),
      (value) => e.tag(value)
    )
  )

  t.true(Array.isArray(response))
  t.true(isRef(response[0]))
  t.true(isRef(response[1]))
})



test('createEmpty', async t => {

  const model = m.struct({
    mySet: m.set(m.struct({
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
          mySet: d.set([d.struct({
            a: d.string('a')
          })]),
        }).toDataConstructor())
      },
      exampleB: refs => {
        return e.data(d.struct({
          mySet: d.set([]),
        }).toDataConstructor())
      },
      exampleC: refs => {
        return e.data(model.decode(
          {
            mySet: [],
          }
        ).toDataConstructor())
      },
    }
  )

  const result = await t.context.exampleQuery(undefined, createMultiple)
  t.true(result && isRef(result.exampleA))
})

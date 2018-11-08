import test from '../_before'
import { xpr as e, val as d, mod as m } from 'karma-sdk-typescript'
import { isRef } from "@karma.run/sdk";

test('annotation', async t => {
  const metaRef = await t.context.adminSession.getMetaModelRef()

  const model = m.struct({
    annotatedKey: m.annotation('custom annotation string', m.string),
    myString: m.string,
  })

  const response = await t.context.exampleQuery('create_0',
    e.create(e.tag('_model'),
      arg => e.data(model.toValue(metaRef.id).toDataConstructor())
    )
  )

  t.true(isRef(response))
})

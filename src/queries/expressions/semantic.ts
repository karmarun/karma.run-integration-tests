import test from '../_before'

import * as e from '@karma.run/sdk/expression'
import * as m from '@karma.run/sdk/model'

import {isRef} from '../utility'

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

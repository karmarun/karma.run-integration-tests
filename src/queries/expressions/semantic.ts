import {model as m, expression as e} from '@karma.run/sdk'
import test from '../_before'

test('annotation', async t => {
  const response = await t.context.exampleQuery('annotation_0',
    e.data(
      m.struct({
        annotatedKey: m.annotation("custom annotation string", m.string())
      })
    )
  )

  t.deepEqual(response, {
    "struct": {
      "annotatedKey": {
        "annotation": {
          "model": {"string": {}},
          "value": "custom annotation string"
        }
      }
    }
  })
})

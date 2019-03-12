import test from '../utils/_before'
import * as mdl from '@karma.run/sdk/model'
import * as xpr from '@karma.run/sdk/expression'
import { createModelsAndTags, isRefTuple, BuiltInTag } from '@karma.run/sdk/utility'

test.serial('createModelsAndTags', async t => {
  const response = await t.context.query(createModelsAndTags({
    'foo': mdl.struct({
      test: mdl.string,
      bar: mdl.dynamicRef('bar')
    }),
    'bar': mdl.struct({
      test: mdl.float
    })
  }))

  const tags = await t.context.query(xpr.tag(BuiltInTag.Tag).all())

  t.truthy(tags.find((value: any) => value.tag === 'foo'))
  t.truthy(tags.find((value: any) => value.tag === 'bar'))

  t.true(isRefTuple(response.foo))
  t.true(isRefTuple(response.bar))
})

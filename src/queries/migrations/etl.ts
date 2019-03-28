import test from '../../utils/_before'

import * as mig from '@karma.run/sdk/migration'
import * as mdl from '@karma.run/sdk/model'
import * as xpr from '@karma.run/sdk/expression'
import * as utl from '@karma.run/sdk/utility';

test('ETL migration', async t => {
  await t.notThrows(async () => {
    const models = await t.context.query(utl.createModelsAndTags({
      foo: mdl.struct({
        foo: mdl.string
      })
    }))

    await t.context.query(xpr.create(xpr.tag('foo'), () => xpr.data(d => d.struct({
      foo: d.string('123')
    }))))

    await mig.migrate(
      t.context.adminSession,
      t.context.adminSession,
      (image, oldTags, newTags) => {
        mig.changeModelByTag(image, oldTags, newTags, 'foo', (rawModel) => {
          rawModel.struct.bar = {string: {}}
          return rawModel
        }, (rawRecord) => {
          rawRecord.bar = '123'
          return rawRecord
        })

        mig.addModel(image, oldTags, newTags, 'bar', mdl.struct({
          foo: mdl.string
        }))

        return image
      }
    )

    const fooResult = await t.context.query(xpr.all(xpr.tag('foo')))
    const barResult = await t.context.query(xpr.all(xpr.tag('bar')))

    t.is(fooResult.length, 1)
    t.is(barResult.length, 0)
  })
})

import {buildExpression} from '@karma.run/sdk'
import test from '../_before'

// TODO
test.skip('manual migration', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_0',
    buildExpression(e =>
      e.define(
        'modelA',
        e.util.createModel(m =>
          m.struct({
            foo: m.string(),
            bar: m.string()
          })
        )
      )
    ),

    buildExpression(e =>
      e.define(
        'modelB',
        e.util.createModel(m =>
          m.struct({
            foo: m.string()
          })
        )
      )
    ),

    buildExpression(e =>
      e.util.createMigration({
        from: e.scope('modelA'),
        to: e.scope('modelB')
      })
    ),

    buildExpression(e =>
      e.data(d =>
        d.struct({
          modelA: d.expr(e => e.scope('modelA')),
          modelB: d.expr(e => e.scope('modelB'))
        })
      )
    )
  )

  const createResponse = await t.context.exampleQuery(
    'manual_migration_1',
    buildExpression(e =>
      e.create(e.data(d => d.ref(response.modelA)), () =>
        e.data(d =>
          d.struct({
            foo: e.string('foo'),
            bar: e.string('bar')
          })
        )
      )
    )
  )

  console.log(createResponse)
  t.pass()
})

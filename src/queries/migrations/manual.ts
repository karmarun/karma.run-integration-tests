import {buildExpressions} from '@karma.run/sdk'
import test from '../_before'

test('manual migration', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_0',
    ...buildExpressions(e => [
      e.define(
        'modelA',
        e.util.createModel(m =>
          m.struct({
            foo: m.string()
          })
        )
      ),
      e.define(
        'modelB',
        e.util.createModel(m =>
          m.struct({
            foo: m.string(),
            bar: m.string()
          })
        )
      ),
      e.util.createMigration({
        from: e.scope('modelA'),
        to: e.scope('modelB'),
        manualExpression: (value) => e.setField('bar', e.string('bar'), value)
      }),
      e.data(d =>
        d.struct({
          modelA: d.expr(e => e.scope('modelA')),
          modelB: d.expr(e => e.scope('modelB'))
        })
      )
    ])
  )

  const createResponse = await t.context.exampleQuery(
    'manual_migration_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () =>
        e.data(d =>
          d.struct({
            foo: e.string('foo')
          })
        )
      ),
      e.data(d =>
        d.struct({
          recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
          recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
        })
      )
    ])
  )

  t.deepEqual(createResponse, {
    recordA: [{foo: 'foo'}],
    recordB: [{foo: 'foo', bar: 'bar'}]
  })
})

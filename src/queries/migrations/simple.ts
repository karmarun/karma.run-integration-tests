import {buildExpression as build, buildExpressions} from '@karma.run/sdk'
import test from '../_before'

test('auto migration', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_0',
    ...buildExpressions(e => [
      e.define(
        'modelA',
        e.util.createModel(m =>
          m.struct({
            foo: m.string(),
            bar: m.string()
          })
        )
      ),
      e.define(
        'modelB',
        e.util.createModel(m =>
          m.struct({
            foo: m.string()
          })
        )
      ),
      e.util.createMigration({
        from: e.scope('modelA'),
        to: e.scope('modelB')
      }),
      e.data(d =>
        d.struct({
          modelA: d.expr(e => e.scope('modelA')),
          modelB: d.expr(e => e.scope('modelB'))
        })
      )
    ])
  )

  const createResponse = await t.context.query(
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () =>
        e.data(d =>
          d.struct({
            foo: e.string('foo'),
            bar: e.string('bar')
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
    recordA: [{foo: 'foo', bar: 'bar'}],
    recordB: [{foo: 'foo'}]
  })
})

// TODO
test.skip('manual migration', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_0',
    build(e =>
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

    build(e =>
      e.define(
        'modelB',
        e.util.createModel(m =>
          m.struct({
            foo: m.string()
          })
        )
      )
    ),

    build(e =>
      e.util.createMigration({
        from: e.scope('modelA'),
        to: e.scope('modelB')
      })
    ),

    build(e =>
      e.data(d =>
        d.struct({
          modelA: d.expr(e => e.scope('modelA')),
          modelB: d.expr(e => e.scope('modelB'))
        })
      )
    )
  )

  console.log(response)

  const createResponse = await t.context.exampleQuery(
    'manual_migration_1',
    build(e =>
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

import {buildExpression as build, buildExpressions, KarmaError, KarmaErrorType} from '@karma.run/sdk'
import test from '../_before'

test('auto migration/remove struct field', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_remove_struct_key_0',
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

  const createResponse = await t.context.exampleQuery(
    'auto_migration_remove_struct_key_1',
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

test('auto migration/add optional', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_add_optional_0',
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
            foo: m.string(),
            bar: m.optional(m.string())
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

  const createResponse = await t.context.exampleQuery(
    'auto_migration_add_optional_1',
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
    recordB: [{foo: 'foo', bar: 'bar'}]
  })
})

test('auto migration/add union case', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_add_union_case_0',
    ...buildExpressions(e => [
      e.define(
        'modelA',
        e.util.createModel(m =>
          m.union({
            foo: m.string(),
            bar: m.int8()
          })
        )
      ),
      e.define(
        'modelB',
        e.util.createModel(m =>
          m.struct({
            foo: m.string(),
            bar: m.int8(),
            baz: m.bool()
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

  const createResponse = await t.context.exampleQuery(
    'auto_migration_add_union_case_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () =>
        e.data(d => d.union('foo', e.string('1234')))
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
    recordB: [{foo: 'foo'}]
  })
})

test('auto migration/invalid', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_invalid_0',
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
            foo: m.string(),
            bar: m.string(),
            baz: m.string()
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

  const error: KarmaError = await t.throws(async () => {
    await t.context.exampleQuery(
      'auto_migration_invalid_1',
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
  }, KarmaError)

  t.is(error.type, KarmaErrorType.CompilationError)
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

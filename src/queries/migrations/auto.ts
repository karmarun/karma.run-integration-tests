import {buildExpressions, KarmaError, KarmaErrorType, isRef} from '@karma.run/sdk'

import test from '../_before'

test('auto migration/same types', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_same_0',
    ...buildExpressions(e => [
      e.define('modelA', e.util.createModel(m => m.string())),
      e.define('modelB', e.util.createModel(m => m.string())),
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
    'auto_migration_same_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () => e.data(d => d.string('foo'))),
      e.data(d =>
        d.struct({
          recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
          recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
        })
      )
    ])
  )

  t.deepEqual(createResponse, {
    recordA: ['foo'],
    recordB: ['foo']
  })
})

test('auto migration/different types', async t => {
  const error: KarmaError = await t.throws(
    async () =>
      await t.context.exampleQuery(
        'auto_migration_remove_tuple_field_0',
        ...buildExpressions(e => [
          e.define('modelA', e.util.createModel(m => m.string())),
          e.define('modelB', e.util.createModel(m => m.int8())),
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
      ),
    KarmaError
  )

  t.is(error.type, KarmaErrorType.AutoMigrationError)
})

test('auto migration/add struct field', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_add_struct_key_0',
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

  const createResponse = await t.context.exampleQuery(
    'auto_migration_add_struct_key_1',
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
    recordB: [{foo: 'foo', bar: 'bar', baz: ''}]
  })
})

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

test('auto migration/remove optional', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_remove_optional_0',
    ...buildExpressions(e => [
      e.define(
        'modelA',
        e.util.createModel(m =>
          m.struct({
            foo: m.string(),
            bar: m.optional(m.string())
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
    'auto_migration_remove_optional_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () =>
        e.data(d =>
          d.struct({
            foo: e.string('foo'),
            bar: e.null()
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
    recordB: [{foo: 'foo', bar: ''}]
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
          m.union({
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
        e.data(d => d.union('foo', e.string('foo')))
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

test('auto migration/remove union case', async t => {
  const error: KarmaError = await t.throws(
    async () =>
      await t.context.exampleQuery(
        'auto_migration_remove_union_case_0',
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
              m.union({
                bar: m.int8()
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
      ),
    KarmaError
  )

  t.is(error.type, KarmaErrorType.CompilationError)
})

test('auto migration/add tuple field', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_add_tuple_field_0',
    ...buildExpressions(e => [
      e.define('modelA', e.util.createModel(m => m.tuple(m.string(), m.int8()))),
      e.define('modelB', e.util.createModel(m => m.tuple(m.string(), m.int8(), m.bool()))),
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
    'auto_migration_add_tuple_field_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () =>
        e.data(d => d.tuple(e.string('foo'), e.int8(0)))
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
    recordA: [['foo', 0]],
    recordB: [['foo', 0, false]]
  })
})

test('auto migration/remove tuple field', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_remove_tuple_field_0',
    ...buildExpressions(e => [
      e.define('modelA', e.util.createModel(m => m.tuple(m.string(), m.int8()))),
      e.define('modelB', e.util.createModel(m => m.tuple(m.string()))),
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
    'auto_migration_remove_tuple_field_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () =>
        e.data(d => d.tuple(e.string('foo'), e.int8(0)))
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
    recordA: [['foo', 0]],
    recordB: [['foo']]
  })
})

test('auto migration/add enum option', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_add_enum_case_0',
    ...buildExpressions(e => [
      e.define('modelA', e.util.createModel(m => m.enum('foo', 'bar'))),
      e.define('modelB', e.util.createModel(m => m.enum('foo', 'bar', 'baz'))),
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
    'auto_migration_add_enum_case_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () => e.symbol('foo')),
      e.data(d =>
        d.struct({
          recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
          recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
        })
      )
    ])
  )

  t.deepEqual(createResponse, {
    recordA: ['foo'],
    recordB: ['foo']
  })
})

test('auto migration/remove enum option', async t => {
  const error: KarmaError = await t.throws(
    async () =>
      await t.context.exampleQuery(
        'auto_migration_remove_enum_option_0',
        ...buildExpressions(e => [
          e.define('modelA', e.util.createModel(m => m.enum('foo', 'bar', 'baz'))),
          e.define('modelB', e.util.createModel(m => m.enum('foo', 'bar'))),
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
      ),
    KarmaError
  )

  t.is(error.type, KarmaErrorType.AutoMigrationError)
})

test('auto migration/simple ref', async t => {
  const response = await t.context.exampleQuery(
    'auto_migration_simple_ref_0',
    ...buildExpressions(e => [
      e.define(
        'models',
        e.util.createModels({
          modelA: (m, d, r) =>
            m.struct({
              ref: m.ref(d.expr(e.field('modelB', r)))
            }),

          modelA2: (m, d, r) =>
            m.struct({
              ref: m.ref(d.expr(e.field('modelB', r))),
              bar: m.string()
            }),

          modelB: (m) => m.string(),
        })
      ),
      e.util.createMigration({
        from: e.field('modelA', e.scope('models')),
        to: e.field('modelA2', e.scope('models'))
      }),
      e.scope('models')
    ])
  )

  const createResponse = await t.context.exampleQuery(
    'auto_migration_simple_ref_1',
    ...buildExpressions(e => [
      e.define('recordB', e.create(e.data(d => d.ref(response.modelB)), () => e.string('foo'))),
      e.create(e.data(d => d.ref(response.modelA)), () => e.data(d => d.struct({
        ref: d.expr(e => e.scope('recordB'))
      }))),
      e.data(d =>
        d.struct({
          recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
          recordA2: d.expr(e.all(e.data(d => d.ref(response.modelA2)))),
          recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
        })
      )
    ])
  )

  t.true(isRef(createResponse.recordA[0].ref))
  t.true(isRef(createResponse.recordA2[0].ref))
  t.is(createResponse.recordA2[0].bar, '')
  t.is(createResponse.recordB[0], 'foo')
})

test.skip('auto migration/circular ref', async t => {
  // TODO
  const response = await t.context.exampleQuery(
    'auto_migration_circular_ref_0',
    ...buildExpressions(e => [
      e.define(
        'models',
        e.util.createModels({
          modelA: (m, d, r) =>
            m.struct({
              ref: m.ref(d.expr(e.field('modelB', r)))
            }),

          modelA2: (m, d, r) =>
            m.struct({
              ref: m.ref(d.expr(e.field('modelB', r))),
              bar: m.string()
            }),

          modelB: (m, d, r) => m.ref(d.expr(e.field('modelC', r))),
          modelB2: (m, d, r) => m.ref(d.expr(e.field('modelC2', r))),

          modelC: (m, d, r) => m.optional(m.ref(d.expr(e.field('modelA', r)))),
          modelC2: (m, d, r) => m.optional(m.ref(d.expr(e.field('modelA2', r))))
        })
      ),
      e.util.createMigration({
        from: e.field('modelA', e.scope('models')),
        to: e.field('modelA2', e.scope('models'))
      }),
      e.scope('models')
    ])
  )

  const createResponse = await t.context.exampleQuery(
    'auto_migration_circular_ref_1',
    ...buildExpressions(e => [
      e.define('recordC', e.create(e.data(d => d.ref(response.modelC)), () => e.null())),
      e.define('recordB', e.create(e.data(d => d.ref(response.modelB)), () => e.scope('recordC'))),
      e.define('recordA', e.create(e.data(d => d.ref(response.modelA)), () => e.data(d => d.struct({
        ref: d.expr(e => e.scope('recordB'))
      })))),
      e.data(d =>
        d.struct({
          recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
          recordA2: d.expr(e.all(e.data(d => d.ref(response.modelA2)))),
          recordB: d.expr(e.all(e.data(d => d.ref(response.modelB)))),
          recordC: d.expr(e.all(e.data(d => d.ref(response.modelC)))),
        })
      )
    ])
  )

  t.true(isRef(createResponse.recordA[0].ref))
  t.true(isRef(createResponse.recordA2[0].ref))
  t.is(createResponse.recordA2[0].bar, '')
  t.is(createResponse.recordB[0], 'foo')
})

import * as e from '@karma.run/sdk/expression'
import * as m from '@karma.run/sdk/model'
import * as d from '@karma.run/sdk/value'
import * as u from '@karma.run/sdk/utility'
import test from '../../utils/_before'

test('same types', async t => {
  const metaRef = await t.context.adminSession.getMetaModelRef()
  const dataContext = e.DataContext

  const model = m.string

  u.createModels({
    model: model
  })

  const response = await t.context.exampleQuery('create_1',
    e.define('modelA',
      e.create(e.tag('_model'),
        arg => e.data(model.toValue(metaRef.id).toDataConstructor())
      )
    ),
    e.define('modelB',
      e.create(e.tag('_model'),
        arg => e.data(model.toValue(metaRef.id).toDataConstructor())
      )
    ),
    e.create(e.tag('_tag'),
      arg => e.data(dataContext.struct({
        tag: dataContext.string('modelA'),
        model: dataContext.expr(e.scope('modelA'))
      })
      )
    ),
    e.create(e.tag('_migration'),
      arg => e.data(
        dataContext.list([
          dataContext.struct({
            expression: dataContext.union('auto',
              dataContext.struct({})
            ),
            source: dataContext.expr(e.scope('modelA')),
            target: dataContext.expr(e.scope('modelB')),
          })
        ])
      )
    ),
    e.data(
      dataContext.struct({
        modelA: dataContext.expr(e.scope('modelA')),
        modelB: dataContext.expr(e.scope('modelB'))
      })
    ),
  )

  const createResponse = await t.context.exampleQuery(
    'auto_migration_same_1',
    e.create(
      e.data(d => d.ref(response.modelA)),
      () => e.data(d => d.string('foo'))
    ),
    e.data(d =>
      d.struct({
        recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
        recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
      })
    )
  )

  t.deepEqual(createResponse, {
    recordA: ['foo'],
    recordB: ['foo']
  })
})



// test('different types', async t => {
//   const error: KarmaError = await t.throws(
//     async () =>
//       await t.context.exampleQuery(
//         'auto_migration_remove_tuple_field_0',
//         ...buildExpressions(e => [
//           e.define('modelA', e.util.createModel(m => m.string())),
//           e.define('modelB', e.util.createModel(m => m.int8())),
//           e.util.createMigration({
//             from: e.scope('modelA'),
//             to: e.scope('modelB')
//           }),
//           e.data(d =>
//             d.struct({
//               modelA: d.expr(e => e.scope('modelA')),
//               modelB: d.expr(e => e.scope('modelB'))
//             })
//           )
//         ])
//       ),
//     KarmaError
//   )

//   t.is(error.type, KarmaErrorType.AutoMigrationError)
// })

// test('add struct field', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_add_struct_key_0',
//     ...buildExpressions(e => [
//       e.define(
//         'modelA',
//         e.util.createModel(m =>
//           m.struct({
//             foo: m.string(),
//             bar: m.string()
//           })
//         )
//       ),
//       e.define(
//         'modelB',
//         e.util.createModel(m =>
//           m.struct({
//             foo: m.string(),
//             bar: m.string(),
//             baz: m.string()
//           })
//         )
//       ),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB')
//       }),
//       e.data(d =>
//         d.struct({
//           modelA: d.expr(e => e.scope('modelA')),
//           modelB: d.expr(e => e.scope('modelB'))
//         })
//       )
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_add_struct_key_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d =>
//           d.struct({
//             foo: e.string('foo'),
//             bar: e.string('bar')
//           })
//         )
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [{foo: 'foo', bar: 'bar'}],
//     recordB: [{foo: 'foo', bar: 'bar', baz: ''}]
//   })
// })

// test('remove struct field', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_remove_struct_key_0',
//     ...buildExpressions(e => [
//       e.define(
//         'modelA',
//         e.util.createModel(m =>
//           m.struct({
//             foo: m.string(),
//             bar: m.string()
//           })
//         )
//       ),
//       e.define(
//         'modelB',
//         e.util.createModel(m =>
//           m.struct({
//             foo: m.string()
//           })
//         )
//       ),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB')
//       }),
//       e.data(d =>
//         d.struct({
//           modelA: d.expr(e => e.scope('modelA')),
//           modelB: d.expr(e => e.scope('modelB'))
//         })
//       )
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_remove_struct_key_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d =>
//           d.struct({
//             foo: e.string('foo'),
//             bar: e.string('bar')
//           })
//         )
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [{foo: 'foo', bar: 'bar'}],
//     recordB: [{foo: 'foo'}]
//   })
// })

// test('add optional', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_add_optional_0',
//     ...buildExpressions(e => [
//       e.define(
//         'modelA',
//         e.util.createModel(m =>
//           m.struct({
//             foo: m.string(),
//             bar: m.string()
//           })
//         )
//       ),
//       e.define(
//         'modelB',
//         e.util.createModel(m =>
//           m.struct({
//             foo: m.string(),
//             bar: m.optional(m.string())
//           })
//         )
//       ),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB')
//       }),
//       e.data(d =>
//         d.struct({
//           modelA: d.expr(e => e.scope('modelA')),
//           modelB: d.expr(e => e.scope('modelB'))
//         })
//       )
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_add_optional_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d =>
//           d.struct({
//             foo: e.string('foo'),
//             bar: e.string('bar')
//           })
//         )
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [{foo: 'foo', bar: 'bar'}],
//     recordB: [{foo: 'foo', bar: 'bar'}]
//   })
// })

// test('remove optional', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_remove_optional_0',
//     ...buildExpressions(e => [
//       e.define(
//         'modelA',
//         e.util.createModel(m =>
//           m.struct({
//             foo: m.string(),
//             bar: m.optional(m.string())
//           })
//         )
//       ),
//       e.define(
//         'modelB',
//         e.util.createModel(m =>
//           m.struct({
//             foo: m.string(),
//             bar: m.string()
//           })
//         )
//       ),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB')
//       }),
//       e.data(d =>
//         d.struct({
//           modelA: d.expr(e => e.scope('modelA')),
//           modelB: d.expr(e => e.scope('modelB'))
//         })
//       )
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_remove_optional_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d =>
//           d.struct({
//             foo: e.string('foo'),
//             bar: e.null()
//           })
//         )
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [{foo: 'foo'}],
//     recordB: [{foo: 'foo', bar: ''}]
//   })
// })

// test('add union case', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_add_union_case_0',
//     ...buildExpressions(e => [
//       e.define(
//         'modelA',
//         e.util.createModel(m =>
//           m.union({
//             foo: m.string(),
//             bar: m.int8()
//           })
//         )
//       ),
//       e.define(
//         'modelB',
//         e.util.createModel(m =>
//           m.union({
//             foo: m.string(),
//             bar: m.int8(),
//             baz: m.bool()
//           })
//         )
//       ),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB')
//       }),
//       e.data(d =>
//         d.struct({
//           modelA: d.expr(e => e.scope('modelA')),
//           modelB: d.expr(e => e.scope('modelB'))
//         })
//       )
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_add_union_case_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d => d.union('foo', e.string('foo')))
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [{foo: 'foo'}],
//     recordB: [{foo: 'foo'}]
//   })
// })

// test('remove union case', async t => {
//   const error: KarmaError = await t.throws(
//     async () =>
//       await t.context.exampleQuery(
//         'auto_migration_remove_union_case_0',
//         ...buildExpressions(e => [
//           e.define(
//             'modelA',
//             e.util.createModel(m =>
//               m.union({
//                 foo: m.string(),
//                 bar: m.int8()
//               })
//             )
//           ),
//           e.define(
//             'modelB',
//             e.util.createModel(m =>
//               m.union({
//                 bar: m.int8()
//               })
//             )
//           ),
//           e.util.createMigration({
//             from: e.scope('modelA'),
//             to: e.scope('modelB')
//           }),
//           e.data(d =>
//             d.struct({
//               modelA: d.expr(e => e.scope('modelA')),
//               modelB: d.expr(e => e.scope('modelB'))
//             })
//           )
//         ])
//       ),
//     KarmaError
//   )

//   t.is(error.type, KarmaErrorType.CompilationError)
// })

// test('add tuple field', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_add_tuple_field_0',
//     ...buildExpressions(e => [
//       e.define('modelA', e.util.createModel(m => m.tuple(m.string(), m.int8()))),
//       e.define('modelB', e.util.createModel(m => m.tuple(m.string(), m.int8(), m.bool()))),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB')
//       }),
//       e.data(d =>
//         d.struct({
//           modelA: d.expr(e => e.scope('modelA')),
//           modelB: d.expr(e => e.scope('modelB'))
//         })
//       )
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_add_tuple_field_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d => d.tuple(e.string('foo'), e.int8(0)))
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [['foo', 0]],
//     recordB: [['foo', 0, false]]
//   })
// })

// test('remove tuple field', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_remove_tuple_field_0',
//     ...buildExpressions(e => [
//       e.define('modelA', e.util.createModel(m => m.tuple(m.string(), m.int8()))),
//       e.define('modelB', e.util.createModel(m => m.tuple(m.string()))),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB')
//       }),
//       e.data(d =>
//         d.struct({
//           modelA: d.expr(e => e.scope('modelA')),
//           modelB: d.expr(e => e.scope('modelB'))
//         })
//       )
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_remove_tuple_field_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d => d.tuple(e.string('foo'), e.int8(0)))
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [['foo', 0]],
//     recordB: [['foo']]
//   })
// })

// test('add enum option', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_add_enum_case_0',
//     ...buildExpressions(e => [
//       e.define('modelA', e.util.createModel(m => m.enum('foo', 'bar'))),
//       e.define('modelB', e.util.createModel(m => m.enum('foo', 'bar', 'baz'))),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB')
//       }),
//       e.data(d =>
//         d.struct({
//           modelA: d.expr(e => e.scope('modelA')),
//           modelB: d.expr(e => e.scope('modelB'))
//         })
//       )
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_add_enum_case_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () => e.symbol('foo')),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: ['foo'],
//     recordB: ['foo']
//   })
// })

// test('remove enum option', async t => {
//   const error: KarmaError = await t.throws(
//     async () =>
//       await t.context.exampleQuery(
//         'auto_migration_remove_enum_option_0',
//         ...buildExpressions(e => [
//           e.define('modelA', e.util.createModel(m => m.enum('foo', 'bar', 'baz'))),
//           e.define('modelB', e.util.createModel(m => m.enum('foo', 'bar'))),
//           e.util.createMigration({
//             from: e.scope('modelA'),
//             to: e.scope('modelB')
//           }),
//           e.data(d =>
//             d.struct({
//               modelA: d.expr(e => e.scope('modelA')),
//               modelB: d.expr(e => e.scope('modelB'))
//             })
//           )
//         ])
//       ),
//     KarmaError
//   )

//   t.is(error.type, KarmaErrorType.AutoMigrationError)
// })

// test('simple ref', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_simple_ref_0',
//     ...buildExpressions(e => [
//       e.define(
//         'models',
//         e.util.createModels({
//           modelA: (m, d, r) =>
//             m.struct({
//               ref: m.ref(d.expr(e.field('modelB', r)))
//             }),

//           modelA2: (m, d, r) =>
//             m.struct({
//               ref: m.ref(d.expr(e.field('modelB', r))),
//               bar: m.string()
//             }),

//           modelB: m => m.string()
//         })
//       ),
//       e.util.createMigration({
//         from: e.field('modelA', e.scope('models')),
//         to: e.field('modelA2', e.scope('models'))
//       }),
//       e.scope('models')
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_simple_ref_1',
//     ...buildExpressions(e => [
//       e.define('recordB', e.create(e.data(d => d.ref(response.modelB)), () => e.string('foo'))),
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d =>
//           d.struct({
//             ref: d.expr(e => e.scope('recordB'))
//           })
//         )
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordA2: d.expr(e.all(e.data(d => d.ref(response.modelA2)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.true(isRef(createResponse.recordA[0].ref))
//   t.true(isRef(createResponse.recordA2[0].ref))
//   t.is(createResponse.recordA2[0].bar, '')
//   t.is(createResponse.recordB[0], 'foo')
// })

// test('circular ref', async t => {
//   const response = await t.context.exampleQuery(
//     'auto_migration_circular_ref_0',
//     ...buildExpressions(e => [
//       e.define(
//         'models',
//         e.util.createModels({
//           modelA: (m, d, r) =>
//             m.struct({
//               ref: m.ref(d.expr(e.field('modelB', r)))
//             }),

//           modelA2: (m, d, r) =>
//             m.struct({
//               ref: m.ref(d.expr(e.field('modelB2', r))),
//               bar: m.string()
//             }),

//           modelB: (m, d, r) => m.ref(d.expr(e.field('modelC', r))),
//           modelB2: (m, d, r) => m.ref(d.expr(e.field('modelC2', r))),

//           modelC: (m, d, r) => m.optional(m.ref(d.expr(e.field('modelA', r)))),
//           modelC2: (m, d, r) => m.optional(m.ref(d.expr(e.field('modelA2', r))))
//         })
//       ),
//       e.util.createMigration(
//         {
//           from: e.field('modelC', e.scope('models')),
//           to: e.field('modelC2', e.scope('models'))
//         },
//         {
//           from: e.field('modelB', e.scope('models')),
//           to: e.field('modelB2', e.scope('models'))
//         },
//         {
//           from: e.field('modelA', e.scope('models')),
//           to: e.field('modelA2', e.scope('models'))
//         }
//       ),
//       e.scope('models')
//     ])
//   )

//   const createResponse = await t.context.exampleQuery(
//     'auto_migration_circular_ref_1',
//     ...buildExpressions(e => [
//       e.define('recordC', e.create(e.data(d => d.ref(response.modelC)), () => e.null())),
//       e.define('recordB', e.create(e.data(d => d.ref(response.modelB)), () => e.scope('recordC'))),
//       e.define(
//         'recordA',
//         e.create(e.data(d => d.ref(response.modelA)), () =>
//           e.data(d =>
//             d.struct({
//               ref: d.expr(e => e.scope('recordB'))
//             })
//           )
//         )
//       ),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordA2: d.expr(e.all(e.data(d => d.ref(response.modelA2)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB)))),
//           recordB2: d.expr(e.all(e.data(d => d.ref(response.modelB2)))),
//           recordC: d.expr(e.all(e.data(d => d.ref(response.modelC)))),
//           recordC2: d.expr(e.all(e.data(d => d.ref(response.modelC2))))
//         })
//       )
//     ])
//   )

//   t.is(createResponse.recordA.length, 1)
//   t.is(createResponse.recordA2.length, 1)
//   t.true(isRef(createResponse.recordA[0].ref))
//   t.true(isRef(createResponse.recordA2[0].ref))

//   t.is(createResponse.recordB.length, 1)
//   t.is(createResponse.recordB2.length, 1)
//   t.true(isRef(createResponse.recordB[0]))
//   t.true(isRef(createResponse.recordB2[0]))

//   t.is(createResponse.recordC.length, 1)
//   t.is(createResponse.recordC2.length, 1)
//   t.is(createResponse.recordC[0], null)
//   t.is(createResponse.recordC2[0], null)
// })

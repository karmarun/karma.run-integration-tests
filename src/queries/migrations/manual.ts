import * as e from '@karma.run/sdk/expression'
import * as m from '@karma.run/sdk/model'
import * as d from '@karma.run/sdk/value'
import * as u from '@karma.run/sdk/utility'
import test from '../../utils/_before'

test('same types', async t => {
  const metaRef = await t.context.adminSession.getMetaModelRef()
  const dataContext = e.DataContext

  const modelA = m.struct({
    foo: m.string,
  })

  const modelB = m.struct({
    foo: m.string,
    bar: m.string,
  })

  const expression = e.func(
    value => e.setField(
      'bar',
      e.string('bar'),
      value
    )
  )

  const response = await t.context.exampleQuery('manual_migration_add_struct_field_0',
    e.define('modelA',
      e.create(e.tag('_model'),
        arg => e.data(modelA.toValue(metaRef.id).toDataConstructor())
      )
    ),
    e.define('modelB',
      e.create(e.tag('_model'),
        arg => e.data(modelB.toValue(metaRef.id).toDataConstructor())
      )
    ),
    e.define('migrationExpression',
      e.create(
        e.tag('_expression'),
        arg => e.data(expression.toValue().toDataConstructor())
      ),
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
            expression: dataContext.union('manual', dataContext.expr(e.scope('migrationExpression'))),
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
    'manual_migration_add_struct_field_1',
    e.create(
      e.data(d => d.ref(response.modelA)),
      () => e.data(d => d.struct({
        foo: d.string('foo')
      }))
    ),
    e.data(d =>
      d.struct({
        recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
        recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
      })
    )
  )

  const a = {
    "recordA": [
      {
        "foo": "foo"
      }
    ],
    "recordB": [
      {
        "bar": "bar",
        "foo": "foo"
      }
    ]
  }

  t.deepEqual(createResponse,
    {
      recordA: [{ foo: 'foo' }],
      recordB: [{ foo: 'foo', bar: 'bar' }]
    }
  )
})

// test('remove struct field', async t => {
//   const response = await t.context.exampleQuery(
//     'manual_migration_remove_struct_field_0',
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
//         to: e.scope('modelB'),
//         manualExpression: value => value
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
//     'manual_migration_remove_struct_field_1',
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

// test('remove enum case', async t => {
//   const response = await t.context.exampleQuery(
//     'manual_migration_remove_enum_case_0',
//     ...buildExpressions(e => [
//       e.define('modelA', e.util.createModel(m => m.enum('foo', 'bar', 'baz'))),
//       e.define('modelB', e.util.createModel(m => m.enum('foo', 'bar'))),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB'),
//         manualExpression: value =>
//           e.if(e.equal(value, e.symbol('baz')), e.symbol('foo'), e.symbol('bar'))
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
//     'manual_migration_remove_enum_case_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () => e.symbol('baz')),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: ['baz'],
//     recordB: ['foo']
//   })
// })

// test('remove union case', async t => {
//   const response = await t.context.exampleQuery(
//     'manual_migration_remove_union_field_0',
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
//             foo: m.string()
//           })
//         )
//       ),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB'),
//         manualExpression: value =>
//           e.switchCase(value, {
//             foo: value => e.data(d => d.union('foo', d.expr(() => value))),
//             bar: () => e.data(d => d.union('foo', d.string('bar')))
//           })
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
//     'manual_migration_remove_union_field_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () => e.data(d => d.union('bar', e.int8(0)))),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [{bar: 0}],
//     recordB: [{foo: 'bar'}]
//   })
// })

// test('remove optional', async t => {
//   const response = await t.context.exampleQuery(
//     'manual_migration_remove_optional_field_0',
//     ...buildExpressions(e => [
//       e.define('modelA', e.util.createModel(m => m.optional(m.string()))),
//       e.define('modelB', e.util.createModel(m => m.string())),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB'),
//         manualExpression: value => e.if(e.isPresent(value), e.assertPresent(value), e.string('foo'))
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
//     'manual_migration_remove_optional_field_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () => e.data(d => d.null())),
//       e.data(d =>
//         d.struct({
//           recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
//           recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
//         })
//       )
//     ])
//   )

//   t.deepEqual(createResponse, {
//     recordA: [null],
//     recordB: ['foo']
//   })
// })

// test('join strings', async t => {
//   const response = await t.context.exampleQuery(
//     'manual_migration_join_strings_0',
//     ...buildExpressions(e => [
//       e.define('modelA', e.util.createModel(m => m.list(m.string()))),
//       e.define('modelB', e.util.createModel(m => m.string())),
//       e.util.createMigration({
//         from: e.scope('modelA'),
//         to: e.scope('modelB'),
//         manualExpression: value => e.joinStrings(e.string(','), value)
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
//     'manual_migration_remove_join_strings_1',
//     ...buildExpressions(e => [
//       e.create(e.data(d => d.ref(response.modelA)), () =>
//         e.data(d => d.list(d.string('1'), d.string('2'), d.string('3')))
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
//     recordA: [['1', '2', '3']],
//     recordB: ['1,2,3']
//   })
// })

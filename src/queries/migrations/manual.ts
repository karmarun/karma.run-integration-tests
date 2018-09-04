import {buildExpressions} from '@karma.run/sdk'
import test from '../_before'

test('add struct field', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_add_struct_field_0',
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
        manualExpression: value => e.setField('bar', e.string('bar'), value)
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
    'manual_migration_add_struct_field_1',
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

test('remove struct field', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_remove_struct_field_0',
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
        to: e.scope('modelB'),
        manualExpression: value => value
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
    'manual_migration_remove_struct_field_1',
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

test('remove enum case', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_remove_enum_case_0',
    ...buildExpressions(e => [
      e.define('modelA', e.util.createModel(m => m.enum('foo', 'bar'))),
      e.define('modelB', e.util.createModel(m => m.enum('foo'))),
      e.util.createMigration({
        from: e.scope('modelA'),
        to: e.scope('modelB'),
        manualExpression: value =>
          e.switchCase(value, {
            foo: () => e.symbol('foo'),
            bar: () => e.symbol('foo')
          })
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
    'manual_migration_remove_enum_case_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () => e.symbol('bar')),
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

test('remove union case', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_remove_union_field_0',
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
            foo: m.string()
          })
        )
      ),
      e.util.createMigration({
        from: e.scope('modelA'),
        to: e.scope('modelB'),
        manualExpression: value =>
          e.switchCase(value, {
            foo: value => e.data(d => d.union('foo', d.expr(() => value))),
            bar: () => e.data(d => d.union('foo', d.string('bar')))
          })
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
    'manual_migration_remove_union_field_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () => e.data(d => d.union('bar', e.int8(0)))),
      e.data(d =>
        d.struct({
          recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
          recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
        })
      )
    ])
  )

  t.deepEqual(createResponse, {
    recordA: [{bar: 0}],
    recordB: [{foo: 'bar'}]
  })
})

test('remove optional', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_remove_optional_field_0',
    ...buildExpressions(e => [
      e.define('modelA', e.util.createModel(m => m.optional(m.string()))),
      e.define('modelB', e.util.createModel(m => m.string())),
      e.util.createMigration({
        from: e.scope('modelA'),
        to: e.scope('modelB'),
        manualExpression: value => e.if(e.isPresent(value), e.assertPresent(value), e.string('foo'))
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
    'manual_migration_remove_optional_field_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () => e.data(d => d.null())),
      e.data(d =>
        d.struct({
          recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
          recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
        })
      )
    ])
  )

  t.deepEqual(createResponse, {
    recordA: [null],
    recordB: ['foo']
  })
})

test('join strings', async t => {
  const response = await t.context.exampleQuery(
    'manual_migration_join_strings_0',
    ...buildExpressions(e => [
      e.define('modelA', e.util.createModel(m => m.list(m.string()))),
      e.define('modelB', e.util.createModel(m => m.string())),
      e.util.createMigration({
        from: e.scope('modelA'),
        to: e.scope('modelB'),
        manualExpression: value => e.joinStrings(e.string(','), value)
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
    'manual_migration_remove_join_strings_1',
    ...buildExpressions(e => [
      e.create(e.data(d => d.ref(response.modelA)), () => e.data(d => d.list(
        d.string('1'),
        d.string('2'),
        d.string('3')
      ))),
      e.data(d =>
        d.struct({
          recordA: d.expr(e.all(e.data(d => d.ref(response.modelA)))),
          recordB: d.expr(e.all(e.data(d => d.ref(response.modelB))))
        })
      )
    ])
  )

  t.deepEqual(createResponse, {
    recordA: [['1', '2', '3']],
    recordB: ['1,2,3']
  })
})


import { createMigration, buildExpression as build, createModel } from 'karma.run'
import test from '../_before'

test('auto migration', async t => {
  const response = await t.context.exampleQuery('length_0',
    build(e => e.define('modelA',
      createModel(m => m.struct({
        foo: m.string(),
        bar: m.string()
      }), e)
    )),

    build(e => e.define('modelB',
      createModel(m => m.struct({
        foo: m.string()
      }))
    )),

    build(e => e.data(d => d.struct({
      modelA: d.expr(e => e.scope('modelA')),
      modelB: d.expr(e => e.scope('modelB')),
    }))),

    build(e => createMigration(
      {from: e.scope('modelA'), to: e.scope('modelB')}
    ))
  )

  console.log(response)
  t.fail()
})

// TODO
test('manual migration', async t => {t.fail()})

import {isRef, buildExpression, buildExpressions} from '@karma.run/sdk'
import test from '../_before'

test('isPresent', async t => {
  const response = await t.context.exampleQuery(
    'isPresent_0',
    buildExpression(e =>
      e.data(d =>
        d.list(d.expr(e => e.isPresent(e.string('foo'))), d.expr(e => e.isPresent(e.null())))
      )
    )
  )

  t.deepEqual(response, [true, false])
})

test('presentOrZero', async t => {
  const modelResponse = await t.context.exampleQuery(
    'presentOrZero_0',
    buildExpression(e => e.util.createModel(m => m.optional(m.string())))
  )

  t.true(isRef(modelResponse))

  const dataResponse = await t.context.exampleQuery(
    'presentOrZero_1',
    ...buildExpressions(e => [
      e.define('recordA', e.create(e.data(d => d.ref(modelResponse)), () => e.string('test'))),
      e.define('recordB', e.create(e.data(d => d.ref(modelResponse)), () => e.null())),
      e.data(d => d.struct({
        valueA: d.expr(e.presentOrZero(e.get(e.scope('recordA')))),
        valueB: d.expr(e.presentOrZero(e.get(e.scope('recordB'))))
      }))
    ])
  )

  t.deepEqual(dataResponse, {
    valueA: 'test',
    valueB: ''
  })
})

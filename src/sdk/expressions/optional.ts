import { isRef } from '@karma.run/sdk'
import test from '../_before'
import { xpr as e, val as d, mod as m } from 'karma-sdk-typescript'

test.skip('isPresent', async t => {
  // const metaRef = await t.context.adminSession.getMetaModelRef()
  // const dataContext = e.DataContext
  //
  // const response = await t.context.exampleQuery('isPresent_0',
  //   e.data(d =>
  //     dataContext.list([
  //       dataContext.expr(e.isPresent(e.string('foo'))),
  //       dataContext.expr(e.isPresent(e.null())),
  //     ])
  //   )
  // )
  //
  // t.deepEqual(response, [true, false])
})

test('presentOrZero', async t => {
  const metaRef = await t.context.adminSession.getMetaModelRef()

  const model = m.optional(
    m.string
  )

  const modelResponse = await t.context.exampleQuery('presentOrZero_0',
    e.create(e.tag('_model'), arg => e.data(model.toValue(metaRef.id).toDataConstructor()))
  )

  t.true(isRef(modelResponse))
  //
  // const dataResponse = await t.context.exampleQuery('presentOrZero_1',
  //   ...buildExpressions(e => [
  //     e.define('recordA', e.create(e.data(d => d.ref(modelResponse)), () => e.string('test'))),
  //     e.define('recordB', e.create(e.data(d => d.ref(modelResponse)), () => e.null())),
  //     e.data(d => d.struct({
  //       valueA: d.expr(e.presentOrZero(e.get(e.scope('recordA')))),
  //       valueB: d.expr(e.presentOrZero(e.get(e.scope('recordB'))))
  //     }))
  //   ])
  // )
  //
  // t.deepEqual(dataResponse, {
  //   valueA: 'test',
  //   valueB: ''
  // })
})

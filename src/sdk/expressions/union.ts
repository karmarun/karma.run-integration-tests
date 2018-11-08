import test from '../_before'
import { xpr as e, val as d } from 'karma-sdk-typescript'

test.skip('isCase', async t => {
  // const dataContext = e.DataContext
  //
  // const response = await t.context.exampleQuery('isCase_0',
  //   e.data(dataContext.list(
  //     dataContext.expr(e.isCase(e.data(d.union('foo', d.string('bar'))), e.string('foo'))),
  //     dataContext.expr(e.isCase(e.data(d.union('foo', d.string('bar'))), e.string('bar'))),
  //     )
  //   ))
  //
  // t.deepEqual(response, [true, false])
})

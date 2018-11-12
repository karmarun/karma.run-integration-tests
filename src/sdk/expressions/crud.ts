import { isRef } from '@karma.run/sdk'
import test from '../_before'
import { xpr as e } from 'karma-sdk-typescript'

test('all', async t => {
  const response: any[] = await t.context.exampleQuery('all_0',
    e.all(e.tag('_tag'))
  )

  t.true(Array.isArray(response))

  response.forEach(value => {
    t.is(typeof value.tag, 'string')
    t.true(isRef(value.model))
  })
})

test('create', async t => {
  const dataContext = e.DataContext

  const response = await t.context.exampleQuery(undefined,
    e.create(
      e.tag('_tag'),
      arg => e.data(
        dataContext.struct({
          tag: dataContext.string('createTestTag'),
          model: dataContext.expr(e.tag('_model')),
        })
      )
    )
  )

  t.true(isRef(response))
})

test('createMultiple', async t => {
  const dataContext = e.DataContext

  const response = await t.context.exampleQuery(undefined,
    e.createMultiple(e.tag('_tag'), {
      tagA: arg => e.data(
        dataContext.struct({
          tag: dataContext.string('createMultipleTestTag_0'),
          model: dataContext.expr(e.tag('_model'))
        })
      ),

      tagB: arg => e.data(
        dataContext.struct({
          tag: dataContext.string('createMultipleTestTag_1'),
          model: dataContext.expr(e.tag('_model'))
        })
      )
    }),
  )

  t.true(isRef(response.tagA))
  t.true(isRef(response.tagB))
})

test('get', async t => {
  const dataContext = e.DataContext

  const response = await t.context.exampleQuery(undefined,
    e.define('getTestTag',
      e.create(
        e.tag('_tag'),
        arg => e.data(
          dataContext.struct({
            tag: dataContext.string('getTestTag'),
            model: dataContext.expr(e.tag('_model'))
          })
        ),
      )),

    e.get(e.scope('getTestTag'))
  )

  t.is(response.tag, 'getTestTag')
})

test('update', async t => {
  const dataContext = e.DataContext
  const response = await t.context.exampleQuery(undefined,

    e.define('updateTestTag',
      e.create(
        e.tag('_tag'),
        arg => e.data(
          dataContext.struct({
            tag: dataContext.string('updateTestTag'),
            model: dataContext.expr(e.tag('_model'))
          })
        )
      )
    ),

    e.update(
      e.scope('updateTestTag'),
      e.data(arg =>
        dataContext.struct({
          tag: dataContext.string('renamedUpdateTestTag'),
          model: dataContext.expr(e.tag('_model'))
        })
      )
    ),

    e.get(e.scope('updateTestTag')),
  )

  t.is(response.tag, 'renamedUpdateTestTag')
})

test('delete', async t => {
  const dataContext = e.DataContext

  const error = await t.throwsAsync(async () => {
    await t.context.exampleQuery(undefined,
      e.define('deleteTestTag',
        e.create(
          e.tag('_tag'),
          art => e.data(
            dataContext.struct({
              tag: dataContext.string('deleteTestTag'),
              model: dataContext.expr(e.tag('_model'))
            })
          )
        )
      ),
      e.delete_(e.scope('deleteTestTag')),
      e.get(e.scope('deleteTestTag')),
    )
  }, Error)

  t.truthy(error)
})

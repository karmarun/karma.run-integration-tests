import { buildExpression as build, KarmaError, KarmaErrorType, isRef } from '@karma.run/sdk'
import test from '../_before'

test('all', async t => {
  const response: any[] = await t.context.exampleQuery('all_0', build(e =>
    e.all(e.tag('_tag')))
  )

  t.true(Array.isArray(response))

  response.forEach(value => {
    t.is(typeof value.tag, 'string')
    t.true(isRef(value.model))
  })
})

test('create', async t => {
  const response = await t.context.exampleQuery(undefined, build(e =>
    e.create(e.tag('_tag'), () => e.data(d =>
      d.struct({
        tag: d.string('createTestTag'),
        model: d.expr(e => e.tag('_model'))
      })
    ))
  ))

  t.true(isRef(response))
})

test('createMultiple', async t => {
  const response = await t.context.exampleQuery(undefined, build(e =>
    e.createMultiple(e.tag('_tag'), {
      tagA: () => e.data(d =>
        d.struct({
          tag: d.string('createMultipleTestTag_0'),
          model: d.expr(e => e.tag('_model'))
        })
      ),

      tagB: () => e.data(d =>
        d.struct({
          tag: d.string('createMultipleTestTag_1'),
          model: d.expr(e => e.tag('_model'))
        })
      )
    }),
  ))

  t.true(isRef(response.tagA))
  t.true(isRef(response.tagB))
})

test('get', async t => {
  const response = await t.context.exampleQuery(undefined,
    build(e =>
      e.define('getTestTag', e.create(e.tag('_tag'), () => e.data(d =>
        d.struct({
          tag: d.string('getTestTag'),
          model: d.expr(e => e.tag('_model'))
        })
      )),
    )),

    build(e =>
      e.get(e.scope('getTestTag'))
    )
  )

  t.is(response.tag, 'getTestTag')
})

test('update', async t => {
  const response = await t.context.exampleQuery(undefined,
    build(e =>
      e.define('updateTestTag', e.create(e.tag('_tag'), () => e.data(d =>
        d.struct({
          tag: d.string('updateTestTag'),
          model: d.expr(e => e.tag('_model'))
        })
      )),
    )),

    build(e =>
      e.update(e.scope('updateTestTag'), e.data(d =>
        d.struct({
          tag: d.string('renamedUpdateTestTag'),
          model: d.expr(e => e.tag('_model'))
        })
      ))
    ),

    build(e =>
      e.get(e.scope('updateTestTag')),
    )
  )

  t.is(response.tag, 'renamedUpdateTestTag')
})

test('delete', async t => {
  const error: KarmaError = await t.throws(async () => {
    await t.context.exampleQuery(undefined,
      build(e =>
        e.define('deleteTestTag', e.create(e.tag('_tag'), () => e.data(d =>
          d.struct({
            tag: d.string('deleteTestTag'),
            model: d.expr(e => e.tag('_model'))
          })
        )),
      )),

      build(e =>
        e.delete(e.scope('deleteTestTag')),
      ),

      build(e =>
        e.get(e.scope('deleteTestTag')),
      ),
    )
  }, KarmaError)

  t.is(error.type, KarmaErrorType.ObjectNotFoundError)
})

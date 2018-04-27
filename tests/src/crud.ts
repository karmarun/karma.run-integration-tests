import { data as d, expression as e, model as m, func as f } from 'karma.run'
import test from './_before'

const recordIdRegex = /^[\S]{10,}$/

test.serial('get', async t => {
  const response = await t.context.exampleQuery(
    'Simple get',
    '',
    e.get(e.refTo(e.first(e.all(e.tag(d.string('_tag'))))))
  )

  t.truthy(response.model)
  t.truthy(response.tag)
})

test('metarialize', async t => {
  const response = await t.context.exampleQuery(
    'Simple metarialize',
    '',
    e.metarialize(e.first(e.all(e.tag(d.string('_tag')))))
  )

  t.truthy(response.created)
  t.truthy(response.updated)
  t.truthy(response.id)
  t.truthy(response.model)
  t.truthy(response.value)
})

test.serial('model create', async t => {
  const response = await t.context.exampleQuery(
    'Simple Model Create',
    '',
    e.create(e.tag(d.string('_model')), f.func(['param'],
      d.data(m.struct({
        'myString': m.string(),
        'myInt': m.int32(),
        'myBool': m.bool()
      }))
    ))
  )

  t.regex(response[0], recordIdRegex)
  t.regex(response[1], recordIdRegex)
})

test.serial('nested create', async t => {
  const createModel = e.create(
    e.tag(d.string('_model')),
    f.func(['param'],
      d.data(m.struct({
        'myString': m.string(),
        'myInt': m.int32(),
        'myBool': m.bool()
      }))
    ))

  const createTag = e.create(
    e.tag(d.string('_tag')),
    f.func(['param'],
      d.data(d.struct({
        'tag': d.string('myModel'),
        'model': e.expr(e.scope('myNewModel'))
      }))
    ))

  const query = [
    e.define('myNewModel', createModel),
    createTag
  ]

  const response = await t.context.exampleQuery(
    'Nested Model Create',
    '',
    ...query
  )

  t.regex(response[0], recordIdRegex)
  t.regex(response[1], recordIdRegex)
})

test.serial('create record', async t => {
  const response = await t.context.exampleQuery(
    'Create Record',
    '',
    e.create(
      e.tag(d.string('myModel')),
      f.func(['param'],
        d.data(d.struct({
          'myString': d.string('my string content'),
          'myInt': d.int32(333),
          'myBool': d.bool(true)
        }))
      )
    )
  )

  t.regex(response[0], recordIdRegex)
  t.regex(response[1], recordIdRegex)
})


test.serial('update', async t => {
  const updateResponse = await t.context.exampleQuery(
    'Simple update',
    '',
    e.update(
      e.refTo(e.first(e.all(e.tag(d.string('myModel'))))),
      d.data(d.struct({
        'myString': d.string('my updated string content'),
        'myInt': d.int32(777),
        'myBool': d.bool(false)
      }))
    )
  )

  t.regex(updateResponse[0], recordIdRegex)
  t.regex(updateResponse[1], recordIdRegex)

  const getResponse = await t.context.exampleQuery(
    '',
    '',
    e.get(e.refTo(e.first(e.all(e.tag(d.string('myModel'))))))
  )

  t.deepEqual(getResponse, {
    myBool: false,
    myInt: 777,
    myString: 'my updated string content'
  })
})

test.serial('delete', async t => {
  const response = await t.context.exampleQuery(
    'Simple delete',
    '',
    e.del(
      e.refTo(e.first(e.all(e.tag(d.string('myModel')))))
    )
  )

  t.deepEqual(response, {
      myBool: false,
      myInt: 777,
      myString: 'my updated string content'
    }
  )
})

test('zero', async t => {
  const response = await t.context.exampleQuery(
    'Create with zero',
    '',
    e.create(
      e.tag(d.string('myModel')),
      f.func(['param'],
        d.zero()
      )
    )
  )

  t.regex(response[0], recordIdRegex)
  t.regex(response[1], recordIdRegex)
})
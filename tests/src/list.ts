
import { data as d, expression as e, func as f } from 'karma.run'
import test from './_before'

test('mapList', async t => {
  const response = await t.context.exampleQuery(
    'Simple mapList',
    '',
    e.mapList(
      e.all(e.tag(d.string('_tag'))),
      f.func(['index', 'value'], e.field('tag', e.scope('value')))
    )
  )

  t.deepEqual(response.sort(), [
    '_expression', '_migration', '_model', '_role', '_tag', '_user'
  ].sort())
})

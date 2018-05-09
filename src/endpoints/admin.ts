import baseTest, { TestInterface } from 'ava'
import { Client } from 'karma.run'
import { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } from '../helpers/_environment'

interface AdminTestContext {
  client: Client
}

const test = baseTest as TestInterface<AdminTestContext>

test.before(async t => {
  const client = new Client(KARMA_ENDPOINT)
  await client.authenticate('admin', KARMA_INSTANCE_SECRET)
  t.context.client = client
})

test.skip('exportDB/importDB', async t => {
  const response = await t.context.client.exportDB()

  // Will be ArrayBuffer in browser
  t.true(response instanceof Buffer)

  // TODO: Reenable once import is fixed.
  // const response = await t.context.client.importDB(t.context.exportData)
  // console.log(response)
})

test.serial('reset', async t => {
  await t.notThrows(async () => {
    return await t.context.client.reset()
  })
})

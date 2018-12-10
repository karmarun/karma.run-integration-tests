import baseTest, { TestInterface } from 'ava'
import { Remote, UserSession, DatabaseAdminSession } from '@karma.run/sdk'
import { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } from '../utils/_environment'

interface AdminTestContext {
  client: Remote
  adminSession: DatabaseAdminSession
}

const test = baseTest as TestInterface<AdminTestContext>

test.before(async t => {
  const client = new Remote(KARMA_ENDPOINT)
  const session = await client.adminLogin('admin', KARMA_INSTANCE_SECRET)
  t.context.client = client
  t.context.adminSession = session
})

// TODO: Reenable once "gzip" problem is solved
// test.skip('exportDB/importDB', async t => {
//   const response = await t.context.adminSession.exportDB()

//   // Will be ArrayBuffer in browser
//   t.true(response instanceof Buffer)

//   await t.notThrows(async () => {
//     const importResponse = await t.context.adminSession.importDB(response)
//     console.log(importResponse)
//   })
// })

test.serial('reset', async t => {
  await t.notThrows(async () => {
    return await t.context.adminSession.resetDatabase()
  })
})

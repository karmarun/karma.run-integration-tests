import baseTest, { TestInterface } from 'ava'
import { Remote, UserSession, DatabaseAdminSession } from '@karma.run/sdk'
import { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } from '../utils/_environment'
import { createModel } from '@karma.run/sdk/utility';
import * as mdl from '@karma.run/sdk/model'
import * as xpr from '@karma.run/sdk/expression'

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

test.serial('exportDB/importDB', async t => {
  const queryResponse = await t.context.adminSession.do(createModel(mdl.string))
  const ref = queryResponse.this

  const response = await t.context.adminSession.export()

  // Will be ArrayBuffer in browser
  t.true(response instanceof Buffer || response instanceof ArrayBuffer)

  await t.notThrows(async () => {
    const newSession = await t.context.adminSession.import(response)
    const queryResponse = await newSession.do(xpr.get(xpr.data(d => d.ref(ref))))

    t.deepEqual(queryResponse, {string: {}})
  })
})

test.serial('reset', async t => {
  await t.notThrows(async () => {
    return await t.context.adminSession.resetDatabase()
  })
})

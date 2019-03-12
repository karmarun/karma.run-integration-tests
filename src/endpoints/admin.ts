import baseTest, { TestInterface } from 'ava'
import { Remote, AdminSession } from '@karma.run/sdk'
import { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } from '../utils/_environment'
import { createModel } from '@karma.run/sdk/utility';
import * as mdl from '@karma.run/sdk/model'
import * as xpr from '@karma.run/sdk/expression'

interface AdminTestContext {
  client: Remote
  adminSession: AdminSession
}

const test = baseTest as TestInterface<AdminTestContext>

test.before(async t => {
  const client = new Remote(KARMA_ENDPOINT)
  const session = await client.adminLogin(KARMA_INSTANCE_SECRET)
  t.context.client = client
  t.context.adminSession = session
})

test.serial('exportDB/importDB', async t => {
  const ref = await t.context.adminSession.do(createModel(mdl.string))
  const response = await t.context.adminSession.export()

  // Will be ArrayBuffer in browser
  t.true(response instanceof Buffer || response instanceof ArrayBuffer)

  await t.notThrows(async () => {
    await t.context.adminSession.import(response)
    const queryResponse = await t.context.adminSession.do(xpr.get(xpr.data(d => d.ref(ref))))

    t.deepEqual(queryResponse, {string: {}})
  })
})

test.serial('reset', async t => {
  await t.notThrows(async () => {
    return await t.context.adminSession.resetDatabase()
  })
})

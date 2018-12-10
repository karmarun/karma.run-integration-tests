import baseTest, { TestInterface } from 'ava'
import { Remote } from '@karma.run/sdk'
import { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } from '../utils/_environment'

interface AuthTestContext {
  client: Remote
}

const test = baseTest as TestInterface<AuthTestContext>

test.before(async t => {
  t.context.client = new Remote(KARMA_ENDPOINT)
})

test.serial('valid', async t => {
  await t.notThrows(async () => {
    return await t.context.client.login('admin', KARMA_INSTANCE_SECRET)
  })
})

test.serial('invalid', async t => {
  const error: Error = await t.throwsAsync(async () => {
    return await t.context.client.login('admin', 'invalidpassword')
  }, Error)
  t.truthy(error)
})

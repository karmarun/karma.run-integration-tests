import baseTest, { TestInterface } from 'ava'
import { Client, KarmaError, KarmaErrorType } from 'karma.run'
import { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } from '../helpers/_environment'

interface AuthTestContext {
  client: Client
}

const test = baseTest as TestInterface<AuthTestContext>

test.before(async t => {
  t.context.client = new Client(KARMA_ENDPOINT)
})

test.serial('valid', async t => {
  await t.notThrows(async () => {
    return await t.context.client.authenticate('admin', KARMA_INSTANCE_SECRET)
  })
})

test.serial('invalid', async t => {
  const error: KarmaError = await t.throws(async () => {
    return await t.context.client.authenticate('admin', 'invalidpassword')
  }, KarmaError)

  t.is(error.type, KarmaErrorType.PermissionDeniedError)
})

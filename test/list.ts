import 'dotenv/config'
import test from 'ava'
import { login } from './sdk/api'

test('test', async (t) => {
  await login(process.env.KARMA_ENDPOINT, 'admin', process.env.KARMA_INSTANCE_SECRET)
  t.is(true, true)
})

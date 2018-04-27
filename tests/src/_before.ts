import 'dotenv/config'
import baseTest, { TestInterface } from 'ava'
import { Client, Expression, func as f } from 'karma.run'

export interface TestContext {
  client: Client
  exampleQuery: (title: string, description: string, ...queries: Expression[]) => any
}

export const test = baseTest as TestInterface<TestContext>

test.before('Create session', async t => {
  if (!process.env.KARMA_ENDPOINT) throw new Error('Environment variable "KARMA_ENDPOINT" not found!')
  if (!process.env.KARMA_INSTANCE_SECRET) throw new Error('Environment variable "KARMA_INSTANCE_SECRET" not found!')

  const client = new Client(process.env.KARMA_ENDPOINT)

  await client.authenticate('admin', process.env.KARMA_INSTANCE_SECRET)
  await client.reset()
  await client.authenticate('admin', process.env.KARMA_INSTANCE_SECRET)

  t.context.client = client
  t.context.exampleQuery = (_title: string, _description: string, ...queries: Expression[]) => {
    // TODO: Extract into JSON
    return client.query(f.func([], ...queries))
  }
})

export default test
import 'dotenv/config'
import baseTest, { TestInterface } from 'ava'
import { Client, Expression, func as f } from 'karma.run'

export const recordIdRegex = /^[\S]{10,}$/

export interface TestContext {
  client: Client
  exampleQuery: (name: string, ...queries: Expression[]) => Promise<any>
  query: (...queries: Expression[]) => Promise<any>
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
  t.context.exampleQuery = (_name, ...queries) => {
    // TODO: Extract into JSON
    return client.query(f.func([], ...queries))
  }

  t.context.query = (...queries) => {
    return client.query(f.func([], ...queries))
  }
})

export default test
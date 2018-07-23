import baseTest, { TestInterface } from 'ava'
import { Client, Expression, func as f } from '@karma.run/sdk'
import { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } from '../helpers/_environment'

export const recordIDRegex = /^[\S]{10,}$/

export interface QueryTestContext {
  client: Client
  exampleQuery: (name: string, ...queries: Expression[]) => Promise<any>
  query: (...queries: Expression[]) => Promise<any>
}

export const test = baseTest as TestInterface<QueryTestContext>

test.before(async t => {
  const client = new Client(KARMA_ENDPOINT)

  t.context.client = client
  t.context.exampleQuery = (_name, ...queries) => {
    // TODO: Extract into JSON
    return client.query(f.function([], ...queries))
  }

  t.context.query = (...queries) => {
    return client.query(f.function([], ...queries))
  }

  await client.authenticate('admin', KARMA_INSTANCE_SECRET)
})

test.after(async t => {
  await t.context.client.reset()
})

export default test
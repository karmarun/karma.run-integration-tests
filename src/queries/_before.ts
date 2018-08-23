import baseTest, {TestInterface} from 'ava'
import {Client, Expression, func as f} from '@karma.run/sdk'
import {KARMA_ENDPOINT, KARMA_INSTANCE_SECRET} from '../helpers/_environment'
import * as fs from 'fs'
import {Error} from 'tslint/lib/error'

export interface QueryTestContext {
  client: Client
  exampleQuery: (name?: string, ...queries: Expression[]) => Promise<any>
  query: (...queries: Expression[]) => Promise<any>
}

export const test = baseTest as TestInterface<QueryTestContext>

async function writeFile(filePath: string, json: any) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filePath, JSON.stringify(json, null, 2), function(error) {
      if (error) {
        return reject(error)
      } else {
        resolve(true)
      }
    })
  })
}

test.before(async t => {
  const client = new Client(KARMA_ENDPOINT)

  t.context.client = client
  t.context.exampleQuery = async (name, ...queries) => {
    const result = await t.context.query(...queries)

    if (process.env.EXTRACT_QUERIES === 'true' && name) {
      const filePath = `./temp/queries/${name}`
      const example = {
        query: queries[queries.length - 1],
        result
      }
      if (fs.existsSync(filePath)) {
        throw new Error(`more than one definition of ${name}`)
      }
      writeFile(filePath, example).catch(console.error)
    }
    return result
  }

  let queryCounter: number = 0

  t.context.query = (...queries) => {
    const func = f.function([], ...queries)

    if (process.env.PRINT_QUERIES === 'true' || process.env.PRINT_QUERIES === '1') {
      queryCounter += 1

      const title = `#${queryCounter}`

      console.log(title)
      console.log('='.repeat(title.length))
      console.log(JSON.stringify(func, undefined, 2))
      console.log('\n')
    }

    return client.query(func)
  }

  await client.authenticate('admin', KARMA_INSTANCE_SECRET)
})

test.after(async t => {
  await t.context.client.reset()
})

export default test

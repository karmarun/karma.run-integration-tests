import baseTest, {TestInterface} from 'ava'
import {Client, Expression, func as f} from '@karma.run/sdk'
import {KARMA_ENDPOINT, KARMA_INSTANCE_SECRET} from '../helpers/_environment'
import * as fs from 'fs'

export interface QueryTestContext {
  client: Client
  exampleQuery: (name?: string, ...queries: Expression[]) => Promise<any>
  query: (...queries: Expression[]) => Promise<any>
}

export const test = baseTest as TestInterface<QueryTestContext>

async function writeFile(filePath: string, json: any) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filePath, JSON.stringify(json, null, 2), function (error) {
      if (error) {
        return reject(error)
      }
      else {
        resolve(true)
      }
    })
  })
}

test.before(async t => {
  const client = new Client(KARMA_ENDPOINT)

  t.context.client = client
  t.context.exampleQuery = (_name, ...queries) => {
    if (process.env.EXTRACT_QUERIES === 'true' && _name) {
      const filePath = `./temp/queries/${_name}`
      if (fs.existsSync(filePath)) {
        throw new Error(`more than one definition of ${_name}`)
      }
      writeFile(filePath, queries[0]).catch(console.error)
    }

    // console.log("****************************************************************************************************")
    // console.log(JSON.stringify(f.function([], ...queries)))
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
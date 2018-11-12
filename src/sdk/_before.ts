import baseTest, { TestInterface } from 'ava'
import { tpt, xpr } from 'karma-sdk-typescript'
import { KARMA_ENDPOINT, KARMA_INSTANCE_SECRET } from '../helpers/_environment'
import * as fs from 'fs'

export interface QueryTestContext {
  client: tpt.Remote
  adminSession: any
  exampleQuery: (name?: string, ...queries: any[]) => Promise<any>
  // query: (...queries: Expression[]) => Promise<any>
}

export const test = baseTest as TestInterface<QueryTestContext>

async function writeFile(filePath: string, json: any) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filePath, JSON.stringify(json, null, 2), function (error) {
      if (error) {
        return reject(error)
      } else {
        resolve(true)
      }
    })
  })
}

test.before(async t => {
  const client = new tpt.Remote(KARMA_ENDPOINT)
  t.context.client = client
  let adminSession = await client.adminLogin('admin', KARMA_INSTANCE_SECRET)
  await adminSession.resetDatabase()
  adminSession = await client.adminLogin('admin', KARMA_INSTANCE_SECRET)
  t.context.adminSession = adminSession

  t.context.exampleQuery = async (name, ...queries) => {
    const result = await adminSession.do(...queries)

    if (process.env.EXTRACT_QUERIES === 'true' && name) {
      // TODO
    }
    return result
  }

  // let queryCounter: number = 0
  // t.context.query = (...queries) => {
  //   const func = f.function([], ...queries)
  //
  //   if (process.env.PRINT_QUERIES === 'true' || process.env.PRINT_QUERIES === '1') {
  //     queryCounter += 1
  //
  //     const title = `#${queryCounter}`
  //
  //     console.log(title)
  //     console.log('='.repeat(title.length))
  //     console.log(JSON.stringify(func, undefined, 2))
  //     console.log('\n')
  //   }
  //
  //   return client.query(func)
  // }
})

test.after(async t => {
  await t.context.adminSession.resetDatabase()
})

export default test

import test from './_before'

let data: any = null

test.serial('exportDB', async t => {
  const response = await t.context.client.exportDB()
  data = response

  // Will be ArrayBuffer in browser
  t.true(response instanceof Buffer)
})

test.skip('importDB', async t => {
  const response = await t.context.client.importDB(data)
  console.log(response)
})

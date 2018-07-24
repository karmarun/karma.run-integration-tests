require('dotenv').config()
const {Client} = require('@karma.run/sdk')
const {execCommand, spanProcess} = require('./tools.js')
const {KARMA_ENDPOINT, KARMA_INSTANCE_SECRET} = process.env;

main()
  .catch(function (error) {
    console.log(error)
  })

async function main() {
  const client = new Client(KARMA_ENDPOINT)
  await client.authenticate('admin', KARMA_INSTANCE_SECRET)
  await execCommand("rm -rf ./temp/queries")
  await execCommand("mkdir ./temp/queries")
  await spanProcess("EXTRACT_QUERIES=true yarn", ["test"])
}

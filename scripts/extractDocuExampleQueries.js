require('dotenv').config()
const {execCommand, spanProcess} = require('./tools.js')

main()
  .catch(function (error) {
    console.log(error)
  })

async function main() {
  await execCommand("rm -rf ./temp/queries")
  await execCommand("mkdir ./temp/queries")
  await spanProcess("EXTRACT_QUERIES=true yarn", ["test"])
}

require('dotenv').config()
const {execCommand, spanProcess, askUSer} = require('./tools.js')

main()
  .catch(function (error) {
    console.log(error)
  })

async function main() {
  await execCommand("rm -rf ./temp/queries")
  await execCommand("mkdir ./temp/queries")
  await spanProcess("EXTRACT_QUERIES=true yarn", ["test"])

  const answer = await askUSer('run "cp -Rf ./temp/queries ../karma-documentation/temp" (Yes/No)? ')
  if (answer === 'Yes') {
    await execCommand('rm -rf ../karma-documentation/temp')
    await execCommand('mkdir ../karma-documentation/temp')
    await execCommand('cp -Rf ./temp/queries ../karma-documentation/temp')
  }
}

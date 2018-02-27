require('dotenv').config()
const {KarmaTools} = require('./_karma_tools.js')

const {
  KARMA_ENDPOINT,
  KARMA_INSTANCE_SECRET,
} = process.env

const karmaApi = new KarmaTools(KARMA_ENDPOINT)
karmaApi.signIn('admin', KARMA_INSTANCE_SECRET)
  .then(function (response) {
    return karmaApi.exportDb('./temp/dump.bin.gz')
  })
  .catch(function (error) {
    console.error(error)
  })

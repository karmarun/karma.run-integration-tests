const fs = require('fs')
const { exec } = require('child_process')

main().catch(console.error)

async function main() {
  const instanceSecret = await execCommand('head -c 1024 /dev/urandom | base64')
  const env = {
    'NODE_ENV': 'development',
    'KARMA_ENDPOINT': 'http://karma',
    'KARMA_INSTANCE_SECRET': instanceSecret,
  }
  fs.writeFileSync('./.env', joinStruct(env))
  console.log('created .env')
}

function joinStruct(obj) {
  return Object.entries(obj).reduce((accu, item) => {
    const [key, val] = item
    accu += `${key}=${val}\n`
    return accu
  }, '')
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, function (error, stdout, stderr) {
      if (error) {
        reject(error)
      }
      else {
        resolve(stdout)
      }
    })
  })
}
require('dotenv').config()
const {spanProcess, execCommand} = require('./tools')

const {KARMA_INSTANCE_SECRET, KARMA_DOCKER_IMAGE} = process.env
main().catch(console.error)

async function main() {
  await runNewDockerImage('karma-integration-tests', '8005', KARMA_DOCKER_IMAGE, KARMA_INSTANCE_SECRET)
}

async function runNewDockerImage(name, port, dockerImages, instanceSecret) {
  await removeDockerImage(name, port)
  await spanProcess(`docker`, [`run`,
    `-d`,
    `-e "KARMA_DATA_FILE=/db-karma-run.data"`,
    `-e "KARMA_INSTANCE_SECRET=${instanceSecret}"`,
    `-p ${port}:80`,
    `--name ${name}`,
    dockerImages])
}

async function removeDockerImage(name, port) {

  const result = await execCommand('docker ps -a --format "{{.Ports}}|{{.ID}}|{{.Names}}"', true)
  const foundImage = result.trim()
    .split('\n')
    .map(l => l.split('|'))
    .find((p) => {
      let check = false
      if (port) {
        check = p[0].startsWith(`0.0.0.0:${port}`)
      }
      if (port) {
        check = check || p[2] === name
      }
      return check
    })

  if (foundImage) {
    await spanProcess(`docker`, [`rm`, `-f`, foundImage[1]])
  }
}
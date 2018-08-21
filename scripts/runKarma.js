require('dotenv').config()
const {spanProcess} = require('./tools')

const {KARMA_INSTANCE_SECRET, KARMA_DOCKER_IMAGE} = process.env

main().catch(console.error)

async function main() {
  await runDockerImages('karma-dev-05', '8005')
}

async function runDockerImages(name, port) {
  await spanProcess(`docker`, [`run`,
    `-d`,
    `-e "KARMA_DATA_FILE=/db-karma-run.data"`,
    `-e "KARMA_INSTANCE_SECRET=${KARMA_INSTANCE_SECRET}"`,
    `-p ${port}:80`,
    `--name ${name}`,
    KARMA_DOCKER_IMAGE])
}

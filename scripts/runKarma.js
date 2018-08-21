require('dotenv').config()
const {spanProcess} = require('./tools')

const karmaDockerImage = "gcr.io/karma-run-registry/karma:0.5-6e40cd36d102945a99a4586981102aa8a8fa0f87"

main().catch(console.error)

async function main() {
  await runDockerImages('karma-dev-05', '8005')
}

async function runDockerImages(name, port) {
  await spanProcess(`docker`, [`run`,
    `-d`,
    `-e "KARMA_DATA_FILE=/db-karma-run.data"`,
    `-e "KARMA_INSTANCE_SECRET=${process.env.KARMA_INSTANCE_SECRET}"`,
    `-p ${port}:80`,
    `--name ${name}`,
    karmaDockerImage])
}

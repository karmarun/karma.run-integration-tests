import 'dotenv/config'

if (!process.env.KARMA_ENDPOINT) throw new Error('Environment variable "KARMA_ENDPOINT" not found!')
if (!process.env.KARMA_INSTANCE_SECRET) throw new Error('Environment variable "KARMA_INSTANCE_SECRET" not found!')

export const KARMA_ENDPOINT: string = process.env.KARMA_ENDPOINT
export const KARMA_INSTANCE_SECRET: string = process.env.KARMA_INSTANCE_SECRET

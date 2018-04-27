import { KarmaApi } from './_karmaApi'

const {KARMA_ENDPOINT, KARMA_INSTANCE_SECRET} = process.env

export function createBeforeTestFn(karmaAPI) {
  return async () => {
    await karmaAPI.signIn('admin', KARMA_INSTANCE_SECRET)
    await karmaAPI.instanceAdministratorRequest('admin/reset')
    await karmaAPI.signIn('admin', KARMA_INSTANCE_SECRET)
  }
}

export function createAPI() {
  return new KarmaApi(KARMA_ENDPOINT)
}

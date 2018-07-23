import { buildExpression as build, KarmaError, KarmaErrorType } from '@karma.run/sdk'
import test from './_before'

// TODO: Currently crashes server, so we skip.
test.skip('zeroStackOverflow', async t => {
  const error: KarmaError = await t.throws(async () =>
    await t.context.exampleQuery('zero_0', build(e =>
      e.create(
        e.tag('_model'),
        () => e.zero()
      )
    ))
  , KarmaError)

  t.is(error.type, KarmaErrorType.CompilationError)
})

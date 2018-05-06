import * as t from './types'
import { build, ExpressionContext, ModelContext, createContext, DataContext } from './builder'
// import { expression as e } from './expression'

// {
//   "list": {
//     "struct": {
//       "expression": {
//         "union": {
//           "auto": {
//             "struct": {}
//           },
//           "manual": {
//             "ref": [
//               "OuCcskptUJIXdrjW",
//               "WQymmFscLzLhuJQm"
//             ]
//           }
//         }
//       },
//       "source": {
//         "ref": [
//           "OuCcskptUJIXdrjW",
//           "OuCcskptUJIXdrjW"
//         ]
//       },
//       "target": {
//         "ref": [
//           "OuCcskptUJIXdrjW",
//           "OuCcskptUJIXdrjW"
//         ]
//       }
//     }
//   }
// }
export interface MigrationRecord {
  from: t.Expression,
  to: t.Expression,
  manualExpression?: t.Expression
}

// export function expressionToDataExpression(expr: t.Expression): t.DataExpression {
//   return
// }

export function createModel(
  creator: (m: ModelContext, d: DataContext, ref: t.ScopeFn) => t.DataExpression,
  context: ExpressionContext = createContext()
) {
  return build(
    e => e.create(
      e.tag('_model'),
      (ref) => context.data(
        (d, m) => creator(m, d, ref)
      )
    ),
    context
  )
}

export function createTag(
  tag: string,
  model: t.Expression,
  context: ExpressionContext = createContext()
) {
  return build(
    e => e.create(
      e.tag('_tag'),
      () => context.data(d => d.struct({
        tag: d.string(tag),
        model: d.expr(() => model)
      }))
    ),
    context
  )
}

// export function createExpression() {}

export function createModels(
  creators: {[key: string]:  (m: ModelContext, d: DataContext, refs: t.ScopeFn) => t.DataExpression},
  context: ExpressionContext = createContext()
) {
  const entries = Object.entries(creators)
  const functions: {[key: string]: (refs: t.ScopeFn) => t.Expression} = {}

  for (const [key, creator] of entries) {
    functions[key] = (refs: t.ScopeFn) => context.data((d, m) => creator(m, d, refs))
  }

  return build(
    e => e.createMultiple(e.tag('_model'), functions),
    context
  )
}

export function createMigration(...migrations: MigrationRecord[]): t.Expression {
  return build(e => e.create(
    e.tag('_migration'),
    () => e.data(d =>
      d.list(...migrations.map(
        migration => d.struct({
          from: d.expr(() => migration.from),
          to: d.expr(() => migration.to),
          expression: migration.manualExpression
            ? d.union('auto', d.struct())
            : d.union('auto', d.struct())
        })
      ))
    )
  ))
}
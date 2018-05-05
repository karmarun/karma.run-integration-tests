import * as t from './types'
import { expression as e, data as d, func as f } from './expression'
import { model as m } from './model'

export type ModelContext = typeof modelContext
export type DataContext = ReturnType<typeof createDataContext>
export type DataScopeFn = (e: DataContext, m: ModelContext) => t.DataExpression

export type ExpressionContext = ReturnType<typeof createContext>
export type ExpressionContextFn = (e: ExpressionContext) => t.Expression

export type FunctionBodyFn = (...params: t.ScopeFn[]) => t.Expression | t.Expression[]
export type FunctionBodyContextFn = (e: ExpressionContext) => FunctionBodyFn

export const modelContext = m

export function createDataContext(context: ExpressionContext) {
  return {
    ...d,
    expr(func: ExpressionContextFn) {
      return d.expr(func(context))
    },
  }
}

export function createContext() {
  let paramIndex = 0
  let dataContext!: DataContext

  const context = {
    ...e,
    data(scopeFn: DataScopeFn): t.Expression {
      return e.data(scopeFn(dataContext, modelContext))
    },

    mapList(value: t.Expression, mapper: (value: t.ScopeFn, index: t.ScopeFn) => t.Expression) {
      const currentParamIndex = paramIndex++
      return e.mapList(value, this.function(mapper, [
        `_index_${currentParamIndex}`, `_value_${currentParamIndex}`
      ]))
    },

    reduceList(
      value: t.Expression, initial: t.Expression,
      reducer: (value: t.ScopeFn, nextValue: t.ScopeFn) => t.Expression
    ) {
      const currentParamIndex = paramIndex++
      return e.reduceList(value, initial, this.function(reducer, [
        `_value_${currentParamIndex}`, `_nextValue_${currentParamIndex}`
      ]))
    },

    mapMap(value: t.Expression, func: (value: t.ScopeFn, index: t.ScopeFn) => t.Expression) {
      const currentParamIndex = paramIndex++
      return e.mapMap(value, this.function(func, [
        `_index_${currentParamIndex}`, `_value_${currentParamIndex}`
      ]))
    },

    function(body: FunctionBodyFn, paramNames: string[] = []) {
      if (body.length > 0) {
        for (let i = paramNames.length; i < paramNames.length - body.length; i++) {
          paramNames[i] = `_param_${i}_${paramIndex++}`
        }
      }

      const scopes = paramNames.map(paramName => this.scope(paramName))
      const expressions = body(...scopes)

      return f.function(paramNames, ...(Array.isArray(expressions) ? expressions : [expressions]))
    }
  }

  dataContext = createDataContext(context)
  return context
}

export function build(contextFn: ExpressionContextFn) {
  const context = createContext()
  return contextFn(context)
}

export function buildFunction(
  contextFn: FunctionBodyContextFn, paramNames: string[] = []
) {
  const context = createContext()
  const body = contextFn(context)
  return context.function(body, paramNames)
}

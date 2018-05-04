import { func as f } from './function'
import * as e from './raw'
import { Expression, DataExpression } from './types'

export type ScopeExpression = {scope: string}
export type FunctionBody = (...params: ScopeExpression[]) => Expression

export interface ExpressionScope {
  tag(tag: string | Expression): {tag: string | Expression}
  field(name: string, value: Expression): {field: [string, Expression]}
  data(scopeFn: DataScopeFn): Expression
}

export const dataScope = {
  string: e.string,
  struct: e.struct,
  expr(func: ExpressionScopeFn) {
    return e.expr(func(expressionScope))
  }
}

export const expressionScope: ExpressionScope = {
  tag(tag: string | Expression) {
    if (typeof tag === 'string') {
      return {tag: e.data(e.string(tag))}
    } else {
      return {tag}
    }
  },

  field(name: string, value: Expression) {
    return {field: [name, value]}
  },

  data(scopeFn: DataScopeFn) {
    return e.data(scopeFn(dataScope))
  }
}

export type DataScope = typeof dataScope

export type ExpressionScopeFn = (e: ExpressionScope) => Expression
export type DataScopeFn = (e: DataScope) => DataExpression

export function funct(params: string[], ...bodies: FunctionBody[]) {
  const scopes = params.map(paramName => f.scope(paramName))
  return {function: [params, bodies.map(body => body(...scopes))]}
}

export function build(scopeFn: ExpressionScopeFn) {
  return scopeFn(expressionScope)
}

import { func as f } from './function'
import * as e from './raw'

export type Expression2 = object
export type ScopeExpression = {scope: string}
export type FunctionBody = (...params: ScopeExpression[]) => Expression2

export interface ExpressionScope {
  tag(tag: string | Expression2): {tag: string | Expression2}
  field(name: string, value: Expression2): {field: [string, Expression2]}
  data(scopeFn: DataScopeFn): Expression2
}

export const dataScope = {
  string: e.string,
  struct: e.struct,
  expr(func: ExpressionScopeFn) {
    return e.expr(func(expressionScope))
  }
}

export const expressionScope: ExpressionScope = {
  tag(tag: string | Expression2) {
    if (typeof tag === 'string') {
      return {tag: e.data(e.string(tag))}
    } else {
      return {tag}
    }
  },

  field(name: string, value: Expression2) {
    return {field: [name, value]}
  },

  data(scopeFn: DataScopeFn) {
    return e.data(scopeFn(dataScope))
  }
}

export type DataScope = typeof dataScope

export type ExpressionScopeFn = (e: ExpressionScope) => Expression2
export type DataScopeFn = (e: DataScope) => Expression2

export function funct(params: string[], ...bodies: FunctionBody[]) {
  const scopes = params.map(paramName => f.scope(paramName))
  return {function: [params, bodies.map(body => body(...scopes))]}
}

export function build(scopeFn: ExpressionScopeFn) {
  return scopeFn(expressionScope)
}


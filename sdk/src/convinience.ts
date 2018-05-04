// import * as t from './types'
// import { expression as e } from './expression'

// export type ScopeExpression = {scope: string}
// export type FunctionBody = (...params: ScopeExpression[]) => t.Expression | t.Expression[]

// export type bla = typeof e

// export interface ExpressionScope {
//   data(scopeFn: DataScopeFn): t.Expression
// }

// export const dataScope = {
//   ...e,
//   expr(func: ExpressionScopeFn) {
//     return e.expr(func(expressionScope))
//   },
// }

// export const expressionScope: ExpressionScope = {
//   tag(tag: string | Expression) {
//     if (typeof tag === 'string') {
//       return {tag: e.data(e.string(tag))}
//     } else {
//       return {tag}
//     }
//   },

//   field(name: string, value: Expression) {
//     return {field: [name, value]}
//   },

//   data(scopeFn: DataScopeFn) {
//     return e.data(scopeFn(dataScope))
//   }
// }

// export type DataScope = typeof dataScope

// export type ExpressionScopeFn = (e: ExpressionScope) => Expression
// export type DataScopeFn = (e: DataScope) => DataExpression

// export function funct(params: string[], body: FunctionBody) {
//   const scopes = params.map(paramName => e.scope(paramName))
//   const expressions = body(...scopes)

//   return {function: [params, Array.isArray(expressions) ? expressions : [expressions]]}
// }

// export function build(scopeFn: ExpressionScopeFn) {
//   return scopeFn(expressionScope)
// }

// funct(['test'], (test) => {
//   const blu = e.define('test', e.tag('___bla'))
// })
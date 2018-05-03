import { Expression } from './expression'

export namespace func {
  export function define(key: Expression, value: Expression) {
    return {
      'define': [
        key,
        value
      ]
    }
  }

  export function func(params: Expression = [], ...expression: Expression[]) {
    return {
      'function': [
        params,
        expression
      ]
    }
  }

  export function scope(key: string) {
    return {scope: key}
  }
}

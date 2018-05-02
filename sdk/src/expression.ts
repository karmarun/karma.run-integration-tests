export type Expression = any

export namespace expression {
  export function tag(expr: Expression) {
    return {'tag': expr}
  }

  export function after(tuple: Expression) {
    return {'after': tuple}
  }

  export function before(tuple: Expression) {
    return {'before': tuple}
  }

  export function length(v: Expression) {
    return {'length': v}
  }

  export function all(ref: Expression) {
    return {'all': ref}
  }

  export function gtInt8(a: Expression, b: Expression) {
    return {gtInt8: [a, b]}
  }

  export function ltInt8(a: Expression, b: Expression) {
    return {ltInt8: [a, b]}
  }

  export function gtFloat(a: Expression, b: Expression) {
    return {'gtFloat': [a, b]}
  }

  export function ltFloat(a: Expression, b: Expression) {
    return {'ltFloat': [a, b]}
  }

  export function equal(a: Expression, b: Expression) {
    return {'equal': [a, b]}
  }

  export function and(a: Expression, b: Expression) {
    return {'and': [a, b]}
  }

  export function or(a: Expression, b: Expression) {
    return {'or': [a, b]}
  }

  export function field(key: Expression, value: Expression) {
    return {'field': [key, value]}
  }

  export function key(key: Expression, value: Expression) {
    return {'key': [key, value]}
  }

  export function not(val: Expression) {
    return {'not': val}
  }

  export function addInt8(a: Expression, b: Expression) {
    return {'addInt8': [a, b]}
  }

  export function subInt8(a: Expression, b: Expression) {
    return {'subInt8': [a, b]}
  }

  export function mulInt8(a: Expression, b: Expression) {
    return {'mulInt8': [a, b]}
  }

  export function divInt8(a: Expression, b: Expression) {
    return {'divInt8': [a, b]}
  }

  export function assertPresent(value: Expression) {
    return {'assertPresent': value}
  }

  export function assertCase(caseKey: Expression, value: Expression) {
    return {
      'assertCase': {
        'case': caseKey,
        'value': value
      }
    }
  }

  export function arg() {
    return ['arg', {}]
  }

  export function reduceList(value: Expression, initial: Expression, reducer: Expression) {
    return {reduceList: {value, initial, reducer}}
  }

  export function filterList(value: Expression, expression: Expression) {
    return {filterList: [value, expression]}
  }

  export function refTo(v: Expression) {
    return {'refTo': v}
  }

  export function first(v: Expression) {
    return {'first': v}
  }

  export function ref(...v: Expression[]) {
    if (arguments.length !== 2) {
      throw new Error(`Expecting 2 arguments for union but got ${arguments.length}`)
    }

    return {
      'ref': v
    }
  }

  export function metarialize(v: Expression) {
    return {'metarialize': v}
  }

  /**
   * switches from data to expression scope
   * @param val
   */
  export function expr(val: Expression) {
    return {'expr': val}
  }

  export function define(name: Expression, argument: Expression) {
    return {'define': [name, argument]}
  }

  export function create(model: Expression, val: Expression) {
    return {'create': [model, val]}
  }

  export function createMultiple(model: Expression, values: {[key: string]: Expression}) {
    return {'createMultiple': [model, values]}
  }

  export function update(ref: Expression, val: Expression) {
    return {
      'update': {
        'ref': ref,
        'value': val
      }
    }
  }

  export function del(ref: Expression) {
    return {'delete': ref}
  }

  export function get(ref: Expression) {
    return {'get': ref}
  }

  export function mapList(value: Expression, expression: Expression) {
    return {
      mapList: [value, expression]
    }
  }

  export function inList(list: Expression, value: Expression) {
    return {inList: {in: list, value}}
  }
}

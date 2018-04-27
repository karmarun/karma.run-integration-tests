import { Expression } from './expression'
import { data as d } from './data'

export namespace model {
  export function struct(o: Expression) {
    return d.union(
      'struct',
      d.map(o)
    )
  }

  export function tuple(o: Expression) {
    return d.union(
      'tuple',
      d.list(...o)
    )
  }

  export function list(o: Expression) {
    return d.union(
      'list',
      o
    )
  }

  export function set(o: Expression) {
    return d.union(
      'set',
      o
    )
  }

  export function map(o: Expression) {
    return d.union(
      'map',
      o
    )
  }

  export function optional(o: Expression) {
    return d.union(
      'optional',
      o
    )
  }

  export function unique(o: Expression) {
    return d.union(
      'unique',
      o
    )
  }

  export function annotation(value: Expression, o: Expression) {
    return d.union(
      'annotation',
      d.struct({
        'value': d.string(value),
        'model': o
      })
    )
  }

  export function recursion(label: Expression, o: Expression) {
    return d.union(
      'recursion',
      d.struct({
        'label': d.string(label),
        'model': o
      })
    )
  }

  export function recurse(label: Expression) {
    return d.union(
      'recurse',
      d.string(label)
    )
  }

  export function recursive(top: Expression, modelsMap: Expression) {
    return d.union(
      'recursive',
      d.struct({
        'top': d.string(top),
        'models': d.map(modelsMap)
      })
    )
  }

  export function union(o: Expression) {
    return d.union(
      'union',
      d.map(o)
    )
  }

  export function string() {
    return d.union(
      'string',
      d.struct()
    )
  }

  export function int32() {
    return d.union(
      'int32',
      d.struct()
    )
  }

  export function float() {
    return d.union(
      'float',
      d.struct()
    )
  }

  export function dateTime() {
    return d.union(
      'dateTime',
      d.struct()
    )
  }

  export function enumeration(o: Expression) {
    return d.union(
      'enum',
      d.set(...o)
    )
  }

  export function bool() {
    return d.union(
      'bool',
      d.struct()
    )
  }
}

import * as t from './types'
import { ObjectMap } from './util'
import { expression as e } from './expression'

export const model = {
  bool(): t.UnionFn {
    return e.union('bool', e.struct())
  },

  dateTime(): t.UnionFn {
    return e.union('dateTime', e.struct())
  },

  string(): t.UnionFn {
    return e.union('string', e.struct())
  },

  optional(type: t.DataExpression): t.UnionFn {
    return e.union('optional', type)
  },

  enum(...options: t.StringDataExpression[]): t.UnionFn {
    return e.union('enum', e.set(...options.map(option => {
      if (typeof option === 'string') {
        return e.string(option)
      }

      return option
    })))
  },

  int8(): t.UnionFn {
    return e.union('int8', e.struct())
  },

  int16(): t.UnionFn {
    return e.union('int16', e.struct())
  },

  int32(): t.UnionFn {
    return e.union('int32', e.struct())
  },

  int64(): t.UnionFn {
    return e.union('int64', e.struct())
  },

  uint8(): t.UnionFn {
    return e.union('uint8', e.struct())
  },

  uint16(): t.UnionFn {
    return e.union('uint16', e.struct())
  },

  uint32(): t.UnionFn {
    return e.union('uint32', e.struct())
  },

  uint64(): t.UnionFn {
    return e.union('uint64', e.struct())
  },

  float(): t.UnionFn {
    return e.union('float', e.struct())
  },

  map(type: t.DataExpression): t.UnionFn {
    return e.union('map', type)
  },

  list(type: t.DataExpression): t.UnionFn {
    return e.union('list', type)
  },

  set(type: t.DataExpression): t.UnionFn {
    return e.union('set', type)
  },

  struct(fields: ObjectMap<t.DataExpression> = {}): t.UnionFn {
    return e.union('struct', e.map(fields))
  },

  tuple(...types: t.DataExpression[]): t.UnionFn {
    return e.union('tuple', e.list(...types))
  },

  union(fields: ObjectMap<t.DataExpression> = {}): t.UnionFn {
    return e.union('union', e.map(fields))
  },

  ref(ref: t.DataExpression): t.UnionFn {
    return e.union('ref', ref)
  },

  annotation(value: string, model: t.DataExpression): t.UnionFn {
    return e.union('annotation', e.struct({
      value: e.string(value), model
    }))
  },

  recursion(label: string, model: t.DataExpression): t.UnionFn {
    return e.union('recursion', e.struct({
      label: e.string(label), model
    }))
  },

  recurse(label: string): t.UnionFn {
    return e.union('recurse', e.string(label))
  },

  recursive(top: string, models: ObjectMap<t.DataExpression>): t.UnionFn {
    return e.union('recursive', e.struct({
      top: e.string(top), models: e.map(models)
    }))
  },

  unique(model: t.DataExpression): t.UnionFn {
    return e.union('unique', model)
  }
}

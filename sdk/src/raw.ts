import * as t from './types'
import { ObjectMap } from './util'

const enum NumberType {
  Int8, Int16, Int32, Int64,
  UInt8, UInt16, UInt32, UInt64,
  Float
}

function dataForNumberExpression(expr: t.NumberExpression, type: NumberType) {
  if (typeof expr === 'number') {
    switch (type) {
      default:
      case NumberType.Int8: return int8(expr)
      case NumberType.Int16: return int16(expr)
      case NumberType.Int32: return int32(expr)
      case NumberType.Int64: return int64(expr)
      case NumberType.UInt8: return uint8(expr)
      case NumberType.UInt16: return uint16(expr)
      case NumberType.UInt32: return uint32(expr)
      case NumberType.UInt64: return uint64(expr)
      case NumberType.Float: return float(expr)
    }
  } else {
    return expr
  }
}

function dataForStringExpression(expr: t.StringExpression) {
  if (typeof expr === 'string') {
    return string(expr)
  } else {
    return expr
  }
}

function dataForDateExpression(expr: t.DateExpression) {
  if (typeof expr === 'string' || typeof expr === 'number' || expr instanceof Date) {
    return dateTime(expr)
  } else {
    return expr
  }
}

export function tag(expr: t.StringExpression): t.TagFn {
  return {tag: dataForStringExpression(expr)}
}

export function after(a: t.DateExpression, b: t.DateExpression): t.AfterFn {
  return {after: [dataForDateExpression(a), dataForDateExpression(b)]}
}

export function before(a: t.Expression, b: t.Expression): t.BeforeFn {
  return {before: [dataForDateExpression(a), dataForDateExpression(b)]}
}

export function length(v: t.Expression): t.LengthFn {
  return {length: v}
}

export function all(ref: t.Expression): t.AllFn {
  return {all: ref}
}

export function gtInt8(a: t.NumberExpression, b: t.NumberExpression): t.GtInt8Fn {
  return {gtInt8: [
    dataForNumberExpression(a, NumberType.Int8),
    dataForNumberExpression(b, NumberType.Int8)
  ]}
}

export function ltInt8(a: t.Expression, b: t.Expression): t.LtInt8Fn {
  return {ltInt8: [a, b]}
}

export function gtFloat(a: t.Expression, b: t.Expression): t.GtFloatFn {
  return {gtFloat: [a, b]}
}

export function ltFloat(a: t.Expression, b: t.Expression): t.LtFloatFn {
  return {ltFloat: [a, b]}
}

export function equal(a: t.Expression, b: t.Expression): t.EqualFn {
  return {equal: [a, b]}
}

export function and(a: t.Expression, b: t.Expression): t.AndFn {
  return {and: [a, b]}
}

export function or(a: t.Expression, b: t.Expression): t.OrFn {
  return {or: [a, b]}
}

export function field(key: string, value: t.Expression): t.FieldFn {
  return {field: [key, value]}
}

export function key(key: t.Expression, value: t.Expression): t.KeyFn {
  return {key: [key, value]}
}

export function not(val: t.Expression) {
  return {not: val}
}

export function addInt8(a: t.Expression, b: t.Expression) {
  return {addInt8: [a, b]}
}

export function subInt8(a: t.Expression, b: t.Expression) {
  return {subInt8: [a, b]}
}

export function mulInt8(a: t.Expression, b: t.Expression) {
  return {mulInt8: [a, b]}
}

export function divInt8(a: t.Expression, b: t.Expression) {
  return {divInt8: [a, b]}
}

export function assertPresent(value: t.Expression) {
  return {assertPresent: value}
}

export function assertCase(caseKey: t.Expression, value: t.Expression) {
  return {assertCase: {case: caseKey, value}}
}

export function arg() {
  return {arg: {}}
}

export function reduceList(value: t.Expression, initial: t.Expression, reducer: t.Expression) {
  return {reduceList: {value, initial, reducer}}
}

export function filterList(value: t.Expression, expression: t.Expression) {
  return {filterList: [value, expression]}
}

export function refTo(v: t.Expression) {
  return {refTo: v}
}

export function first(v: t.Expression) {
  return {first: v}
}

export function ref(...v: t.Expression[]) {
  if (arguments.length !== 2) {
    throw new Error(`Expecting 2 arguments for union but got ${arguments.length}`)
  }

  return {ref: v}
}

export function metarialize(v: t.Expression) {
  return {metarialize: v}
}

/**
 * switches from data to t.expression scope
 * @param val
 */
export function expr(val: t.Expression) {
  return {expr: val}
}

export function define(name: t.Expression, argument: t.Expression) {
  return {define: [name, argument]}
}

export function create(model: t.Expression, val: t.Expression) {
  return {create: [model, val]}
}

export function createMultiple(model: t.Expression, values: {[key: string]: t.Expression}) {
  return {createMultiple: [model, values]}
}

export function update(ref: t.Expression, value: t.Expression) {
  return {update: {ref, value}}
}

export function del(ref: t.Expression) {
  return {delete: ref}
}

export function get(ref: t.Expression) {
  return {get: ref}
}

export function mapList(value: t.Expression, expression: t.Expression) {
  return {mapList: [value, expression]}
}

export function inList(list: t.Expression, value: t.Expression) {
  return {inList: {in: list, value}}
}

/**
 * switches t.expression to data scope
 * @param val
 */
export function data(val: t.DataExpression): t.DataFn {
  return {data: val}
}

export function zero() {
  return {zero: {}}
}

export function string(val: string): t.StringFn {
  return {string: val}
}

export function list(...val: t.Expression[]) {
  return {list: val}
}

export function tuple(...val: t.Expression[]) {
  return {tuple: val}
}

export function map(val: t.Expression) {
  return {map: val}
}

export function set(...val: t.Expression[]) {
  return {set: val}
}

export function union(...val: t.Expression[]) {
  if (arguments.length !== 2) {
    throw new Error(`Expecting 2 arguments for union but got ${arguments.length}`)
  }
  return {union: val}
}

export function model(val: t.Expression) {
  return {model: val}
}

export function bool(val: t.Expression) {
  return {bool: val}
}

export function symbol(val: t.Expression) {
  return {symbol: val}
}

export function int8(val: number) {
  return {int8: val}
}

export function int16(val: number) {
  return {int16: val}
}

export function int32(val: number) {
  return {int32: val}
}

export function int64(val: number) {
  return {int64: val}
}

export function uint8(val: number) {
  return {uint8: val}
}

export function uint16(val: number) {
  return {uint16: val}
}

export function uint32(val: number) {
  return {uint32: val}
}

export function uint64(val: number) {
  return {uint64: val}
}

export function float(val: number) {
  return {float: val}
}

export function dateTime(value: string | number | Date): t.DateTimeFn {
  const date = new Date(value)
  return {dateTime: date.toISOString()}
}

export function struct(val: ObjectMap<t.DataExpression> = {}): t.StructFn {
  return {struct: val}
}

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

// Function Scope
// ==============

export function func(params: string[], ...body: t.Expression[]): t.FunctionFn {
  return {function: [params, body]}
}

// Data Scope
// ==========

export function bool(value: boolean): t.BoolFn {
  return {bool: value}
}

export function dateTime(value: string | number | Date): t.DateTimeFn {
  if (typeof value === 'number' || typeof value === 'string') {
    value = new Date(value)
  }

  return {dateTime: value.toISOString()}
}

export function string(value: string): t.StringFn {
  return {string: value}
}

export function nil(): t.NullFn {
  return {null: {}}
}

export function symbol(value: string): t.SymbolFn {
  return {symbol: value}
}

export function int8(value: number): t.Int8Fn {
  return {int8: value}
}

export function int16(value: number): t.Int16Fn {
  return {int16: value}
}

export function int32(value: number): t.Int32Fn {
  return {int32: value}
}

export function int64(value: number): t.Int64Fn {
  return {int64: value}
}

export function uint8(value: number): t.UInt8Fn {
  return {uint8: value}
}

export function uint16(value: number): t.UInt16Fn {
  return {uint16: value}
}

export function uint32(value: number): t.UInt32Fn {
  return {uint32: value}
}

export function uint64(value: number): t.UInt64Fn {
  return {uint64: value}
}

export function float(value: number): t.FloatFn {
  return {float: value}
}

export function map(value: ObjectMap<t.DataExpression>): t.MapFn {
  return {map: value}
}

export function list(...value: t.DataExpression[]): t.ListFn {
  return {list: value}
}

export function set(...value: t.DataExpression[]): t.SetFn {
  return {set: value}
}

export function struct(value: ObjectMap<t.DataExpression>): t.StructFn {
  return {struct: value}
}

export function tuple(...value: t.DataExpression[]): t.TupleFn {
  return {tuple: value}
}

export function union(caseKey: string, value: t.DataExpression): t.UnionFn {
  return {union: [caseKey, value]}
}

export function ref(modelID: string, recordID: string): t.RefFn {
  return {ref: [modelID, recordID]}
}

export function expr(expr: t.Expression): t.ExprFn {
  return {expr}
}

// Expression Scope
// ================

// Other
// -----

export function model(id: t.Expression): t.ModelFn {
  return {model: id}
}

export function modelOf(expr: t.Expression): t.ModelOfFn {
  return {modelOf: expr}
}

export function metarialize(record: t.Expression): t.MetarializeFn {
  return {metarialize: record}
}

export function zero(value: t.Expression): t.ZeroFn {
  return {zero: value}
}

// Scope
// -----

export function data(value: t.DataExpression): t.DataFn {
  return {data: value}
}

export function define(name: string, expr: t.Expression): t.DefineFn {
  return {define: [name, expr]}
}

export function scope(name: string): t.ScopeFn {
  return {scope: name}
}

export function signature(func: t.FuncExpression): t.SignatureFn {
  return {signature: func}
}

// Date Time
// ---------

export function after(valueA: t.DateExpression, valueB: t.DateExpression): t.AfterFn {
  return {after: [dataForDateExpression(valueA), dataForDateExpression(valueB)]}
}

export function before(valueA: t.DateExpression, valueB: t.DateExpression): t.BeforeFn {
  return {before: [dataForDateExpression(valueA), dataForDateExpression(valueB)]}
}

// String
// ------

export function joinString(separator: t.Expression, strings: t.Expression): t.JoinStringsFn {
  return {joinStrings: {separator, strings}}
}

export function stringToLower(value: t.Expression): t.StringToLowerFn {
  return {stringToLower: value}
}

export function matchRegex(
  regex: string, value: t.Expression, caseInsensitive: boolean = false, multiLine: boolean = false
): t.MatchRegexFn {
  return {matchRegex: {regex, value, caseInsensitive, multiLine}}
}

export function searchAllRegex(
  regex: string, value: t.Expression, caseInsensitive: boolean = false, multiLine: boolean = false
): t.SearchAllRegexFn {
  return {searchAllRegex: {regex, value, caseInsensitive, multiLine}}
}

export function searchRegex(
  regex: string, value: t.Expression, caseInsensitive: boolean = false, multiLine: boolean = false
): t.SearchRegexFn {
  return {searchRegex: {regex, value, caseInsensitive, multiLine}}
}

// Optional
// --------

export function isPresent(optional: t.Expression): t.IsPresentFn {
  return {isPresent: optional}
}

// Set
// ---

export function mapSet(value: t.Expression, mapper: t.FuncExpression): t.MapSetFn {
  return {mapSet: [value, mapper]}
}

// Map
// ---

export function setKey(name: string, value: t.Expression, inMap: t.Expression): t.SetKeyFn {
  return {setKey: {name, value, in: inMap}}
}

export function mapMap(value: t.Expression, mapper: t.FuncExpression): t.MapMapFn {
  return {mapMap: [value, mapper]}
}

export function key(name: t.Expression, value: t.Expression): t.KeyFn {
  return {key: [name, value]}
}

// Union
// -----

export function isCase(caseKey: t.Expression, value: t.Expression): t.IsCaseFn {
  return {isCase: {case: caseKey, value}}
}

// Tuple
// -----

export function indexTuple(index: number, value: t.Expression): t.IndexTupleFn {
  return {indexTuple: {number: index, value}}
}

// Struct
// ------

export function extractStrings(value: t.Expression): t.ExtractStringsFn {
  return {extractStrings: value}
}

export function field(name: string, value: t.Expression): t.FieldFn {
  return {field: [name, value]}
}

export function setField(name: string, value: t.Expression, inStruct: t.Expression): t.SetFieldFn {
  return {setField: {name, value, in: inStruct}}
}

// List
// ----

export function concatLists(valueA: t.Expression, valueB: t.Expression): t.ConcatListsFn {
  return {concatLists: [valueA, valueB]}
}

export function filterList(value: t.Expression, filter: t.FuncExpression): t.FilterListFn {
  return {filterList: [value, filter]}
}

export function first(value: t.Expression): t.FirstFn {
  return {first: value}
}

export function inList(value: t.Expression, inList: t.Expression): t.InListFn {
  return {inList: {value, in: inList}}
}

export function mapList(value: t.Expression, mapper: t.FuncExpression): t.MapListFn {
  return {mapList: [value, mapper]}
}

export function length(value: t.Expression): t.LengthFn {
  return {length: value}
}

export function memSort(value: t.Expression, expression: t.Expression): t.MemSortFn {
  return {memSort: {value, expression}}
}

export function reverseList(value: t.Expression): t.ReverseListFn {
  return {reverseList: value}
}

export function slice(value: t.Expression, offset: t.NumberExpression, length: t.NumberExpression): t.SliceFn {
  return {
    slice: {
      value,
      offset: dataForNumberExpression(offset, NumberType.Int64),
      length: dataForNumberExpression(length, NumberType.Int64)
    }
  }
}

export function reduceList(value: t.Expression, initial: t.Expression, reducer: t.FuncExpression): t.ReduceListFn {
  return {reduceList: {value, initial, reducer}}
}

// User / Permission
// -----------------

export function currentUser(): t.CurrentUserFn {
  return {currentUser: {}}
}

// Graph / Referential
// -------------------

export function allReferrers(ref: t.Expression): t.AllReferrersFn {
  return {allReferrers: ref}
}

export function refTo(value: t.Expression): t.RefToFn {
  return {refTo: value}
}

export function referred(from: t.Expression, inRef: t.Expression): t.ReferredFn {
  return {referred: {from, in: inRef}}
}

export function referrers(of: t.Expression, inRef: t.Expression): t.ReferrersFn {
  return {referrers: {of, in: inRef}}
}

export function relocateRef(model: t.Expression, ref: t.Expression): t.RelocateRefFn {
  return {relocateRef: {model, ref}}
}

export function resolveAllRefs(ref: t.Expression): t.ResolveAllRefsFn {
  return {resolveAllRefs: ref}
}

export function tag(value: t.StringExpression): t.TagFn {
  return {tag: dataForStringExpression(value)}
}

export function tagExists(value: t.StringExpression): t.TagExistsFn {
  return {tagExists: dataForStringExpression(value)}
}

export function graphFlow(
  start: t.Expression, flow: {backward: t.Expression[], forward: t.Expression[], from: t.Expression}[]
): t.GraphFlowFn {
  return {graphFlow: {start, flow}}
}

// CRUD
// ----

export function all(ref: t.Expression): t.AllFn {
  return {all: ref}
}

export function create(modelRef: t.Expression, func: t.FuncExpression): t.CreateFn {
  return {create: [modelRef, func]}
}

// TODO: How to insert in different models?
export function createMultiple(modelRef: t.Expression, funcs: ObjectMap<t.FuncExpression>): t.CreateMultipleFn {
  return {createMultiple: [modelRef, funcs]}
}

// delete
export function del(ref: t.Expression): t.DeleteFn {
  return {delete: ref}
}

export function get(ref: t.Expression): t.GetFn {
  return {get: ref}
}

export function update(ref: t.Expression, value: t.Expression): t.UpdateFn {
  return {update: {ref, value}}
}

// Logic
// -----

export function and(...values: t.Expression[]): t.AndFn {
  return {and: values}
}

export function or(...values: t.Expression[]): t.OrFn {
  return {or: values}
}

export function arg(): t.ArgFn {
  return {arg: {}}
}

export function id(): t.IDFn {
  return {id: {}}
}

export function assertCase(caseKey: string, value: t.Expression): t.AssertCaseFn {
  return {assertCase: {case: caseKey, value}}
}

export function asserModelRef(ref: t.Expression, value: t.Expression): t.AssertModelRefFn {
  return {assertModelRef: {ref, value}}
}

export function equal(valueA: t.Expression, valueB: t.Expression): t.EqualFn {
  return {equal: [valueA, valueB]}
}

// if
export function when(condition: t.Expression, then: t.Expression, els: t.Expression): t.IfFn {
  return {if: {condition, then, else: els}}
}

export function not(value: t.Expression): t.NotFn {
  return {not: value}
}

export function presentOrZero(value: t.Expression): t.PresentOrZeroFn {
  return {presentOrZero: value}
}

// with
export function besides(retrn: t.Expression, value: t.Expression): t.WithFn {
  return {with: {return: retrn, value}}
}

export function switchCase(
  value: t.Expression, defaultValue: t.Expression, cases: ObjectMap<t.FuncExpression>
): t.SwitchCaseFn {
  return {switchCase: {value, default: defaultValue, cases}}
}

export function switchModelRef(
  value: t.Expression, defaultValue: t.Expression, cases: {match: t.Expression, return: t.Expression}[]
): t.SwitchModelRefFn {
  return {switchModelRef: {value, default: defaultValue, cases}}
}

// Numeric
// -------

export function addFloat(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddFloatFn {
  return {
    addFloat: [
      dataForNumberExpression(valueA, NumberType.Float),
      dataForNumberExpression(valueB, NumberType.Float)
    ]
  }
}

export function addInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddInt8Fn {
  return {
    addInt8: [
      dataForNumberExpression(valueA, NumberType.Int8),
      dataForNumberExpression(valueB, NumberType.Int8)
    ]
  }
}

export function addInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddInt16Fn {
  return {
    addInt16: [
      dataForNumberExpression(valueA, NumberType.Int16),
      dataForNumberExpression(valueB, NumberType.Int16)
    ]
  }
}

export function addInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddInt32Fn {
  return {
    addInt32: [
      dataForNumberExpression(valueA, NumberType.Int32),
      dataForNumberExpression(valueB, NumberType.Int32)
    ]
  }
}

export function addInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddInt64Fn {
  return {
    addInt64: [
      dataForNumberExpression(valueA, NumberType.Int64),
      dataForNumberExpression(valueB, NumberType.Int64)
    ]
  }
}

export function addUInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddUInt8Fn {
  return {
    addUint8: [
      dataForNumberExpression(valueA, NumberType.UInt8),
      dataForNumberExpression(valueB, NumberType.UInt8)
    ]
  }
}

export function addUInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddUInt16Fn {
  return {
    addUint16: [
      dataForNumberExpression(valueA, NumberType.UInt16),
      dataForNumberExpression(valueB, NumberType.UInt16)
    ]
  }
}

export function addUInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddUInt32Fn {
  return {
    addUint32: [
      dataForNumberExpression(valueA, NumberType.UInt32),
      dataForNumberExpression(valueB, NumberType.UInt32)
    ]
  }
}

export function addUInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.AddUInt64Fn {
  return {
    addUint64: [
      dataForNumberExpression(valueA, NumberType.UInt64),
      dataForNumberExpression(valueB, NumberType.UInt64)
    ]
  }
}

export function subFloat(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubFloatFn {
  return {
    subFloat: [
      dataForNumberExpression(valueA, NumberType.Float),
      dataForNumberExpression(valueB, NumberType.Float)
    ]
  }
}

export function subInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubInt8Fn {
  return {
    subInt8: [
      dataForNumberExpression(valueA, NumberType.Int8),
      dataForNumberExpression(valueB, NumberType.Int8)
    ]
  }
}

export function subInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubInt16Fn {
  return {
    subInt16: [
      dataForNumberExpression(valueA, NumberType.Int16),
      dataForNumberExpression(valueB, NumberType.Int16)
    ]
  }
}

export function subInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubInt32Fn {
  return {
    subInt32: [
      dataForNumberExpression(valueA, NumberType.Int32),
      dataForNumberExpression(valueB, NumberType.Int32)
    ]
  }
}

export function subInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubInt64Fn {
  return {
    subInt64: [
      dataForNumberExpression(valueA, NumberType.Int64),
      dataForNumberExpression(valueB, NumberType.Int64)
    ]
  }
}

export function subUInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubUInt8Fn {
  return {
    subUint8: [
      dataForNumberExpression(valueA, NumberType.UInt8),
      dataForNumberExpression(valueB, NumberType.UInt8)
    ]
  }
}

export function subUInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubUInt16Fn {
  return {
    subUint16: [
      dataForNumberExpression(valueA, NumberType.UInt16),
      dataForNumberExpression(valueB, NumberType.UInt16)
    ]
  }
}

export function subUInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubUInt32Fn {
  return {
    subUint32: [
      dataForNumberExpression(valueA, NumberType.UInt32),
      dataForNumberExpression(valueB, NumberType.UInt32)
    ]
  }
}

export function subUInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.SubUInt64Fn {
  return {
    subUint64: [
      dataForNumberExpression(valueA, NumberType.UInt64),
      dataForNumberExpression(valueB, NumberType.UInt64)
    ]
  }
}

export function divFloat(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivFloatFn {
  return {
    divFloat: [
      dataForNumberExpression(valueA, NumberType.Float),
      dataForNumberExpression(valueB, NumberType.Float)
    ]
  }
}

export function divInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivInt8Fn {
  return {
    divInt8: [
      dataForNumberExpression(valueA, NumberType.Int8),
      dataForNumberExpression(valueB, NumberType.Int8)
    ]
  }
}

export function divInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivInt16Fn {
  return {
    divInt16: [
      dataForNumberExpression(valueA, NumberType.Int16),
      dataForNumberExpression(valueB, NumberType.Int16)
    ]
  }
}

export function divInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivInt32Fn {
  return {
    divInt32: [
      dataForNumberExpression(valueA, NumberType.Int32),
      dataForNumberExpression(valueB, NumberType.Int32)
    ]
  }
}

export function divInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivInt64Fn {
  return {
    divInt64: [
      dataForNumberExpression(valueA, NumberType.Int64),
      dataForNumberExpression(valueB, NumberType.Int64)
    ]
  }
}

export function divUInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivUInt8Fn {
  return {
    divUint8: [
      dataForNumberExpression(valueA, NumberType.UInt8),
      dataForNumberExpression(valueB, NumberType.UInt8)
    ]
  }
}

export function divUInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivUInt16Fn {
  return {
    divUint16: [
      dataForNumberExpression(valueA, NumberType.UInt16),
      dataForNumberExpression(valueB, NumberType.UInt16)
    ]
  }
}

export function divUInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivUInt32Fn {
  return {
    divUint32: [
      dataForNumberExpression(valueA, NumberType.UInt32),
      dataForNumberExpression(valueB, NumberType.UInt32)
    ]
  }
}

export function divUInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.DivUInt64Fn {
  return {
    divUint64: [
      dataForNumberExpression(valueA, NumberType.UInt64),
      dataForNumberExpression(valueB, NumberType.UInt64)
    ]
  }
}

export function mulFloat(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulFloatFn {
  return {
    mulFloat: [
      dataForNumberExpression(valueA, NumberType.Float),
      dataForNumberExpression(valueB, NumberType.Float)
    ]
  }
}

export function mulInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulInt8Fn {
  return {
    mulInt8: [
      dataForNumberExpression(valueA, NumberType.Int8),
      dataForNumberExpression(valueB, NumberType.Int8)
    ]
  }
}

export function mulInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulInt16Fn {
  return {
    mulInt16: [
      dataForNumberExpression(valueA, NumberType.Int16),
      dataForNumberExpression(valueB, NumberType.Int16)
    ]
  }
}

export function mulInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulInt32Fn {
  return {
    mulInt32: [
      dataForNumberExpression(valueA, NumberType.Int32),
      dataForNumberExpression(valueB, NumberType.Int32)
    ]
  }
}

export function mulInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulInt64Fn {
  return {
    mulInt64: [
      dataForNumberExpression(valueA, NumberType.Int64),
      dataForNumberExpression(valueB, NumberType.Int64)
    ]
  }
}

export function mulUInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulUInt8Fn {
  return {
    mulUint8: [
      dataForNumberExpression(valueA, NumberType.UInt8),
      dataForNumberExpression(valueB, NumberType.UInt8)
    ]
  }
}

export function mulUInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulUInt16Fn {
  return {
    mulUint16: [
      dataForNumberExpression(valueA, NumberType.UInt16),
      dataForNumberExpression(valueB, NumberType.UInt16)
    ]
  }
}

export function mulUInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulUInt32Fn {
  return {
    mulUint32: [
      dataForNumberExpression(valueA, NumberType.UInt32),
      dataForNumberExpression(valueB, NumberType.UInt32)
    ]
  }
}

export function mulUInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.MulUInt64Fn {
  return {
    mulUint64: [
      dataForNumberExpression(valueA, NumberType.UInt64),
      dataForNumberExpression(valueB, NumberType.UInt64)
    ]
  }
}

export function ltFloat(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtFloatFn {
  return {
    ltFloat: [
      dataForNumberExpression(valueA, NumberType.Float),
      dataForNumberExpression(valueB, NumberType.Float)
    ]
  }
}

export function ltInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtInt8Fn {
  return {
    ltInt8: [
      dataForNumberExpression(valueA, NumberType.Int8),
      dataForNumberExpression(valueB, NumberType.Int8)
    ]
  }
}

export function ltInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtInt16Fn {
  return {
    ltInt16: [
      dataForNumberExpression(valueA, NumberType.Int16),
      dataForNumberExpression(valueB, NumberType.Int16)
    ]
  }
}

export function ltInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtInt32Fn {
  return {
    ltInt32: [
      dataForNumberExpression(valueA, NumberType.Int32),
      dataForNumberExpression(valueB, NumberType.Int32)
    ]
  }
}

export function ltInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtInt64Fn {
  return {
    ltInt64: [
      dataForNumberExpression(valueA, NumberType.Int64),
      dataForNumberExpression(valueB, NumberType.Int64)
    ]
  }
}

export function ltUInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtUInt8Fn {
  return {
    ltUint8: [
      dataForNumberExpression(valueA, NumberType.UInt8),
      dataForNumberExpression(valueB, NumberType.UInt8)
    ]
  }
}

export function ltUInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtUInt16Fn {
  return {
    ltUint16: [
      dataForNumberExpression(valueA, NumberType.UInt16),
      dataForNumberExpression(valueB, NumberType.UInt16)
    ]
  }
}

export function ltUInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtUInt32Fn {
  return {
    ltUint32: [
      dataForNumberExpression(valueA, NumberType.UInt32),
      dataForNumberExpression(valueB, NumberType.UInt32)
    ]
  }
}

export function ltUInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.LtUInt64Fn {
  return {
    ltUint64: [
      dataForNumberExpression(valueA, NumberType.UInt64),
      dataForNumberExpression(valueB, NumberType.UInt64)
    ]
  }
}

export function gtFloat(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtFloatFn {
  return {
    gtFloat: [
      dataForNumberExpression(valueA, NumberType.Float),
      dataForNumberExpression(valueB, NumberType.Float)
    ]
  }
}

export function gtInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtInt8Fn {
  return {
    gtInt8: [
      dataForNumberExpression(valueA, NumberType.Int8),
      dataForNumberExpression(valueB, NumberType.Int8)
    ]
  }
}

export function gtInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtInt16Fn {
  return {
    gtInt16: [
      dataForNumberExpression(valueA, NumberType.Int16),
      dataForNumberExpression(valueB, NumberType.Int16)
    ]
  }
}

export function gtInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtInt32Fn {
  return {
    gtInt32: [
      dataForNumberExpression(valueA, NumberType.Int32),
      dataForNumberExpression(valueB, NumberType.Int32)
    ]
  }
}

export function gtInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtInt64Fn {
  return {
    gtInt64: [
      dataForNumberExpression(valueA, NumberType.Int64),
      dataForNumberExpression(valueB, NumberType.Int64)
    ]
  }
}

export function gtUInt8(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtUInt8Fn {
  return {
    gtUint8: [
      dataForNumberExpression(valueA, NumberType.UInt8),
      dataForNumberExpression(valueB, NumberType.UInt8)
    ]
  }
}

export function gtUInt16(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtUInt16Fn {
  return {
    gtUint16: [
      dataForNumberExpression(valueA, NumberType.UInt16),
      dataForNumberExpression(valueB, NumberType.UInt16)
    ]
  }
}

export function gtUInt32(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtUInt32Fn {
  return {
    gtUint32: [
      dataForNumberExpression(valueA, NumberType.UInt32),
      dataForNumberExpression(valueB, NumberType.UInt32)
    ]
  }
}

export function gtUInt64(valueA: t.NumberExpression, valueB: t.NumberExpression): t.GtUInt64Fn {
  return {
    gtUint64: [
      dataForNumberExpression(valueA, NumberType.UInt64),
      dataForNumberExpression(valueB, NumberType.UInt64)
    ]
  }
}

export function floatToInt(value: t.NumberExpression): t.FloatToIntFn {
  return {floatToInt: dataForNumberExpression(value, NumberType.Float)}
}

export function intToFloat(value: t.NumberExpression): t.IntToFloatFn {
  return {intToFloat: dataForNumberExpression(value, NumberType.Int64)}
}

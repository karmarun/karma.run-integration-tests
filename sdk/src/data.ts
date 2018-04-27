import { Expression } from './expression'


export namespace data {
  /**
   * switches expression to data scope
   * @param val
   */
  export function data(val: Expression) {
    return {
      'data': val
    }
  }

  export function zero() {
    return {
      'zero': {}
    }
  }


  export function string(val: Expression) {
    return {
      'string': val
    }
  }

  export function list(...val: Expression[]) {
    return {
      'list': val
    }
  }

  export function tuple(...val: Expression[]) {
    return {
      'tuple': val
    }
  }

  export function map(val: Expression) {
    return {
      'map': val
    }
  }

  export function set(...val: Expression[]) {
    return {
      'set': val
    }
  }

  export function union(...val: Expression[]) {
    if (arguments.length !== 2) {
      throw new Error(`Expecting 2 arguments for union but got ${arguments.length}`)
    }
    return {
      'union': val
    }
  }

  export function model(val: Expression) {
    return {
      'model': val
    }
  }

  export function bool(val: Expression) {
    return {
      'bool': val
    }
  }

  export function symbol(val: Expression) {
    return {
      'symbol': val
    }
  }

  export function int8(val: Expression) {
    return {
      'int8': val
    }
  }

  export function int16(val: Expression) {
    return {
      'int16': val
    }
  }

  export function int32(val: Expression) {
    return {
      'int32': val
    }
  }

  export function int64(val: Expression) {
    return {
      'int64': val
    }
  }

  export function uint8(val: Expression) {
    return {
      'uint8': val
    }
  }

  export function uint16(val: Expression) {
    return {
      'uint16': val
    }
  }

  export function uint32(val: Expression) {
    return {
      'uint32': val
    }
  }

  export function uint64(val: Expression) {
    return {
      'uint64': val
    }
  }

  export function float(val: Expression) {
    return {
      'float': val
    }
  }

  export function dateTime(val: Expression) {
    return {
      'dateTime': val
    }
  }

  export function struct(val: Expression = {}) {
    return {
      'struct': val
    }
  }
}
export function karmaFunction(params = [], ...expression) {
  return {
    "function": [
      params,
      expression
    ]
  }
}

export function define(key, value) {
  return {
    "define": [
      key,
      value
    ]
  }
}

export function func(params = [], ...expression) {
  return {
    "function": [
      params,
      expression
    ]
  }
}

# Karma 0.5.0 Changes

### Union 
Karma 0.4 returned a Struct eg:
```
"union": {
  "variantA": {
    "intA": 1,
    "stringA": "a"
  }
}
```
Karma 0.5 returns a Array eg:
```
"union": [
  "variantA",
  {
    "intA": 1,
    "stringA": "a"
  }
]
```

### Optionals
Karma 0.5 return unset optional keys with null

### Any Model
Karma does not support any anymore
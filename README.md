# Плагин для линтера lodash-to-native

## Установка

```
$ npm i eslint --save-dev
$ npm i -S https://github.com/SkyFlame00/eslint-plugin-lodash-to-native.git --save-dev
```

Затем в файл `.eslintrc.js` добавьте:

```json
"parserOptions": {
    "ecmaVersion": 2018
},
{
    "plugins": [
        "lodash-to-native"
    ]
},
{
    "rules": {
        "lodash-to-native/map": 2
    }
}
```

## Что сделано

1. Базовая реализация. Линтер при нахождении выражения

```js
_.map(collection, fn)
```

заменит его на

```js
Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)
```

Если `_.map` находится внутри Binary expression, Logical expression, Conditional expression или Member expression, то линтер пофиксит его и обернет в скобки. Например, это
```js
_.map(collection, fn).map(fn2)
```
превратится в это
```js
(Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)).map(fn2)
```

2. Сделан второй бонус: такое выражение

```js
_.map([1, 2, 3], fn)
```
заменится на такое
```js
[1, 2, 3].map(fn)
```

3. Написаны тесты
# compare errors

## Install

```
npm install compare-errors
```

## Usage

You can compare errors based on:

- constructor:

  ```javascript
  const err = new Error('foo')
  const res = compareErrors(Error)(err)
  // {
  //   type: 'constructor',
  //   matches: true,
  //   actual: 'Error: foo',
  //   expected: 'Error'
  // }
  ```
- constructor and string message:

  ```javascript
  const err = new Error('foo')
  const res = compareErrors(Error, 'foo')(err)
  // {
  //   type: 'message',
  //   matches: true,
  //   actual: 'foo',
  //   expected: 'foo'
  // }
  ```
- constructor and regex message:

  ```javascript
  const err = new Error('foo')
  const res = compareErrors(Error, /bar/)(err)
  // {
  //   type: 'message',
  //   matches: false,
  //   actual: 'foo',
  //   expected: /bar/
  // }
  ```
- just a string or regex:

  ```javascript
  const err = new Error('foo')
  const res = compareErrors(/foo/)(err)
  // {
  //   type: 'message',
  //   matches: true,
  //   actual: 'foo',
  //   expected: /foo/
  // }
  ```
- instance:

  ```javascript
  const err = new Error('foo')
  const err2 = new RangeError('foo')
  const res = compareErrors(err)(err2)
  // {
  //   type: 'instance',
  //   matches: false,
  //   actual: 'RangeError: foo',
  //   expected: 'Error: foo'
  // }
  ```

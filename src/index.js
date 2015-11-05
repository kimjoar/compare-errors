import type from 'type-detect'
import invariant from 'invariant'

function compareErrors (constructor, errMsg) {
  invariant(constructor != null || errMsg != null,
    'Either constructor or message must be specified')

  let desiredError = null
  let name = null

  if (constructor != null && (constructor instanceof RegExp || typeof constructor === 'string')) {
    errMsg = constructor
    constructor = null
  } else if (constructor != null && constructor instanceof Error) {
    desiredError = constructor
    constructor = null
    errMsg = null
  } else if (typeof constructor === 'function') {
    name = constructor.prototype.name
    if (!name || (name === 'Error' && constructor !== Error)) {
      name = constructor.name || (new constructor()).name
    }
  } else {
    constructor = null
  }

  return function (err) {
    // first, check desired error
    if (desiredError) {
      return {
        type: 'instance',
        matches: err === desiredError,
        actual: err instanceof Error ? err.toString() : err,
        expected: desiredError instanceof Error ? desiredError.toString() : desiredError
      }
    }

    // next, check constructor
    if (constructor) {
      const isInstanceOf = err instanceof constructor
      if (!errMsg || !isInstanceOf) {
        return {
          type: 'constructor',
          matches: isInstanceOf,
          actual: err instanceof Error ? err.toString() : err,
          expected: name
        }
      }
    }

    // next, check message
    const message = type(err) === 'error' && 'message' in err
      ? err.message
      : '' + err

    if (message != null && errMsg && errMsg instanceof RegExp) {
      return {
        type: 'message',
        matches: errMsg.test(message),
        actual: message,
        expected: errMsg
      }
    } else if ((message != null) && errMsg && typeof errMsg === 'string') {
      return {
        type: 'message',
        matches: message.indexOf(errMsg) > -1,
        actual: message,
        expected: errMsg
      }
    }
  }
}

export default compareErrors

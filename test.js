/* eslint-env mocha */

import expect from 'expect-to'
import { deepEqual, equal, exist, throws } from 'expect-to-core'
import compareErrors from './src'

describe('compare errors', () => {
  it('throws exception when no arguments specified', () => {
    const err = new Error()

    expect(() => {
      compareErrors()(err);
    }).to(throws('Invariant Violation: Either constructor or message must be specified'));
  })

  describe('when instance', () => {
    it('matches if same instance', () => {
      const err = new Error('foo')
      const res = compareErrors(err)(err)

      expect(res).to(deepEqual({
        type: 'instance',
        matches: true,
        actual: 'Error: foo',
        expected: 'Error: foo'
      }))
    })

    it('does not match if instances of different types', () => {
      const err = new Error('foo')
      const err2 = new RangeError('foo')
      const res = compareErrors(err)(err2)

      expect(res).to(deepEqual({
        type: 'instance',
        matches: false,
        actual: 'RangeError: foo',
        expected: 'Error: foo'
      }))
    })

    it('does not match if two instances of same type', () => {
      const err = new Error('foo')
      const err2 = new Error('foo')
      const res = compareErrors(err2)(err)

      expect(res).to(deepEqual({
        type: 'instance',
        matches: false,
        actual: 'Error: foo',
        expected: 'Error: foo'
      }))
    })
  })

  describe('when constructor', () => {
    context('but no message supplied', () => {
      it('matches constructor of same type', () => {
        const err = new Error('foo')
        const res = compareErrors(Error)(err)

        expect(res).to(deepEqual({
          type: 'constructor',
          matches: true,
          actual: 'Error: foo',
          expected: 'Error'
        }))
      })

      it('does not match constructor of different type', () => {
        const err = new Error('foo')
        const res = compareErrors(TypeError)(err)

        expect(res).to(deepEqual({
          type: 'constructor',
          matches: false,
          actual: 'Error: foo',
          expected: 'TypeError'
        }))
      })
    })

    context('with message supplied', () => {
      context('and message is string', () => {
        it('matches if same type and same message', () => {
          const err = new Error('foo')
          const res = compareErrors(Error, 'foo')(err)

          expect(res).to(deepEqual({
            type: 'message',
            matches: true,
            actual: 'foo',
            expected: 'foo'
          }))
        })

        it('does not match if same type but different message', () => {
          const err = new Error('foo')
          const res = compareErrors(Error, 'bar')(err)

          expect(res).to(deepEqual({
            type: 'message',
            matches: false,
            actual: 'foo',
            expected: 'bar'
          }))
        })

        it('does not match if different type but same message', () => {
          const err = new Error('foo')
          const res = compareErrors(RangeError, 'foo')(err)

          expect(res).to(deepEqual({
            type: 'constructor',
            matches: false,
            actual: 'Error: foo',
            expected: 'RangeError'
          }))
        })
      })

      context('and message is regex', () => {
        it('matches if same type and matching regex', () => {
          const err = new Error('foo')
          const res = compareErrors(Error, /foo/)(err)

          expect(res).to(deepEqual({
            type: 'message',
            matches: true,
            actual: 'foo',
            expected: /foo/
          }))
        })

        it('does not match if same type but not matching regex', () => {
          const err = new Error('foo')
          const res = compareErrors(Error, /bar/)(err)

          expect(res).to(deepEqual({
            type: 'message',
            matches: false,
            actual: 'foo',
            expected: /bar/
          }))
        })
      })
    })
  })

  describe('when only message', () => {
    it('matches when same message', () => {
      const err = new Error('foo')
      const res = compareErrors('foo')(err)

      expect(res).to(deepEqual({
        type: 'message',
        matches: true,
        actual: 'foo',
        expected: 'foo'
      }))
    })

    it('does not match when different message', () => {
      const err = new Error('foo')
      const res = compareErrors('bar')(err)

      expect(res).to(deepEqual({
        type: 'message',
        matches: false,
        actual: 'foo',
        expected: 'bar'
      }))
    })
  })
})

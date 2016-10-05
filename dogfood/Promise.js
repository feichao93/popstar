// todo 只是放在了这里 并没有用起来

const promiseValue = Symbol('PromiseValue')

const promiseStatus = Symbol('PromiseStatus')

const setImmediate = f => setTimeout(f, 0)

const defaultOnFulfilled = value => value

const defaultOnRejected = error => {
  throw error
}

export default class MyPromise {
  constructor(executor) {
    this[promiseStatus] = 'pending'
    this.handlers = []
    this[promiseValue] = null


    const resolve = value => {
      if (this[promiseStatus] !== 'pending') {
        throw new Error('Invalid status when calling `resolve`')
      }
      this[promiseStatus] = 'resolved'
      this[promiseValue] = value
      for (const handler of this.handlers) {
        if (handler.onFulfilled) {
          setImmediate(() => handler.onFulfilled(value))
        }
      }
      this.handlers = []
    }

    const reject = value => {
      if (this[promiseStatus] !== 'pending') {
        throw new Error('Invalid status when calling `reject`')
      }
      this[promiseStatus] = 'rejected'
      this[promiseValue] = value
      for (const handler of this.handlers) {
        if (handler.onRejected) {
          setImmediate(() => handler.onRejected(false, value))
        }
      }
      this.handlers = []
    }

    executor(resolve, reject)
  }

  static resolve(valueOrThenable) {
    if (typeof valueOrThenable === 'object' && valueOrThenable.then) {
      return valueOrThenable
    }
    return new MyPromise(resolve => setImmediate(() => resolve(valueOrThenable)))
  }

  static reject(value) {
    return new MyPromise((resolve, reject) => setImmediate(() => reject(value)))
  }

  static all(promises) {
    let unresolvedCount = promises.length
    const resultArray = []
    let hasRejected = false
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        const success = value => {
          resultArray[index] = value
          unresolvedCount--
          if (unresolvedCount === 0) {
            resolve(resultArray)
          }
        }
        const fail = value => {
          if (!hasRejected) { // 最多reject一次
            hasRejected = true
            reject(value)
          }
        }
        promise.then(success, fail)
      })
    })
  }

  static race(promises) {
    let fired = false // 最多fire一次
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        const success = value => {
          if (!fired) {
            fired = true
            resolve(value)
          }
        }
        const fail = value => {
          if (!fired) {
            fired = true
            reject(value)
          }
        }
        promise.then(success, fail)
      })
    })
  }

  then(onFulfilled = defaultOnFulfilled, onRejected = defaultOnRejected) {
    if (this[promiseStatus] === 'resolved') {
      try {
        return MyPromise.resolve(onFulfilled(this[promiseValue]))
      } catch (e) {
        return MyPromise.reject(e)
      }
    }

    if (this[promiseStatus] === 'rejected') {
      try {
        return MyPromise.resolve(onRejected(this[promiseValue]))
      } catch (e) {
        return MyPromise.reject(e)
      }
    }

    return new MyPromise((resolve, reject) => {
      const makeHandler = callback => value => {
        try {
          resolve(callback(value))
        } catch (e) {
          reject(e)
        }
      }

      this.handlers.push({
        onFulfilled: makeHandler(onFulfilled),
        onRejectet: makeHandler(onRejected),
      })
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
}

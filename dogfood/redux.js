import { OrderedSet } from 'immutable'
import { compose } from './common'

export function createStore(reducer, preloadedState, enhancer) {
  if (enhancer === undefined && typeof preloadedState === 'function') {
    return createStore(reducer, undefined, preloadedState)
  }
  if (enhancer !== undefined) {
    return enhancer(createStore)(reducer, preloadedState)
  }

  let state = preloadedState
  let listeners = OrderedSet()

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
    return action
  }

  const getState = () => state

  const subscribe = (listener) => {
    listeners = listeners.add(listener)
    return function unsubscribe() {
      listeners = listeners.delete(listener)
    }
  }

  dispatch({ type: '@@INIT' })

  return { dispatch, getState, subscribe }
}

export function applyMiddleware(...middlewares) {
  return next => (...args) => { // next == createStore
    const store = next(...args)
    let dispatch = null

    const api = {
      getState: store.getState,
      dispatch: action => dispatch(action),
    }

    const chain = compose(...middlewares.map(middleware => middleware(api)))
    dispatch = chain(store.dispatch)

    return { ...store, dispatch }
  }
}

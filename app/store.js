import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'

let enhancer = compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension && window.devToolsExtension())
if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunkMiddleware)
}

export default createStore(reducer, enhancer)

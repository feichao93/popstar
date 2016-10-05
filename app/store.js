import { createStore, applyMiddleware } from 'dogfood/redux'
import thunkMiddleware from 'dogfood/redux-thunk'
import reducer from './reducer'

export default createStore(reducer, applyMiddleware(thunkMiddleware))

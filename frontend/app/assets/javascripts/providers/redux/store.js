import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export default createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware // lets us dispatch() functions
    )
  )
)

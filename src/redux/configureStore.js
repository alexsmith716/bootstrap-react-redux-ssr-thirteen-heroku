import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createPersistoid, persistCombineReducers, REGISTER } from 'redux-persist';
import clientMiddleware from './clientMiddleware';
import createRootReducer from './reducer';

function combine(reducers, persistConfig) {
  if (persistConfig) {
    return persistCombineReducers(persistConfig, reducers);
  }
  return combineReducers(reducers);
}

function customLogger({ getState }) {
  return next => action => {
    const returnValue = next(action);
    return returnValue;
  }
};

function getNoOperationReducers(reducers, array) {
  if (!array) {
    return {};
  }

  return Object.keys(array).reduce((accu, element) => {
    if (reducers[element]) {
      return accu;
    }

    return {
      ...accu,
      [element]: (state = array[element]) => state
    };
  }, {});
}

// ----------------------------------------------------------------------

export default function configureStore({ data, helpers, persistConfig }) {

  const middleware = [clientMiddleware(helpers)];

  if (__CLIENT__ && __DEVELOPMENT__) {
    middleware.push(customLogger);
  }

  // ----------------------------------------------------------------------

  if (__CLIENT__ && __DEVELOPMENT__) {
    const logger = require('redux-logger').createLogger({
      collapsed: true, 
      colors: {title: () => 'inherit',prevState: () => '#9E9E9E',action: () => '#03A9F4',nextState: () => '#4CAF50',error: () => '#F20404'}
    });
    middleware.push(logger);
  }

  const enhancers = [applyMiddleware(...middleware)];

  if (__CLIENT__ && __DEVELOPMENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools').default;

    Array.prototype.push.apply(enhancers, [
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ]);
  }

  const finalEnhancer = compose(...enhancers)(createStore);
  const reducers = createRootReducer();
  const noopReducers = getNoOperationReducers(reducers, data);
  const store = finalEnhancer(combine({ ...noopReducers, ...reducers }, persistConfig), data);

  store.asyncReducers = {};

  if (persistConfig) {
    const persistoid = createPersistoid(persistConfig);
    store.subscribe(() => {
      persistoid.update(store.getState());
    });
    store.dispatch({ type: REGISTER });
  }

  // ----------------------------------------------------------------------

  if (__DEVELOPMENT__ && module.hot) {
    console.log('>>>>>>>>>>>>>>>>>>> configureStore() > YES MODULE.HOT <<<<<<<<<<<<<<<<<');
    module.hot.accept('./reducer', () => {
      let reducer = require('./reducer');
      reducer = combine((reducer.__esModule ? reducer.default : reducer)(store.asyncReducers), persistConfig);
      store.replaceReducer(reducer);
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> configureStore() > NO MODULE.HOT <<<<<<<<<<<<<<');
  }

  return store;
};

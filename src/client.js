import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { renderRoutes } from 'react-router-config';
import {createBrowserHistory} from 'history';
import { trigger } from 'redial';

import localForage from 'localforage';
import { getStoredState } from 'redux-persist';
import { AppContainer as HotEnabler } from 'react-hot-loader';

import asyncMatchRoutes from './utils/asyncMatchRoutes';
// import { Provider } from './components';
import { Provider } from 'react-redux';
import { RouterTrigger } from './components';
import routes from './routes';
import apiClient from './helpers/apiClient';
import configureStore from './redux/configureStore';
import isOnline from './utils/isOnline';
import NProgress from 'nprogress';
import './js/app';

// =====================================================================

const persistConfig = {
  key: 'root',
  storage: localForage,
  stateReconciler(inboundState, originalState) {
    return originalState;
  },
  whitelist: ['device', 'info', 'counter', 'filterableTable', 'temperatureCalculator']
};

const dest = document.getElementById('content');

// =====================================================================

const client = apiClient();

const providers = {
  client
};

(async () => {

  const preloadedState = await getStoredState(persistConfig);

  const online = window.__data ? true : await isOnline();

  const history = createBrowserHistory();

  const store = configureStore({
    history,
    data: {
      ...preloadedState,
      ...window.__data,
      online
    },
    helpers: providers,
    persistConfig
  });

  // ======================================================================================

  const triggerHooks = async (_routes, pathname) => {
    NProgress.start();

    const { components, match, params } = await asyncMatchRoutes(_routes, pathname);
    
    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    if (window.__PRELOADED__) {
      delete window.__PRELOADED__;
    } else {
      await trigger('fetch', components, triggerLocals);
    }
    await trigger('defer', components, triggerLocals);

    NProgress.done();
  };

  // ======================================================================================

  const hydrate = _routes => {
    const element = (
      <HotEnabler>
        <Provider store={store} {...providers}>
          <Router history={history}>
            <RouterTrigger trigger={pathname => triggerHooks(_routes, pathname)}>{renderRoutes(_routes)}</RouterTrigger>
          </Router>
        </Provider>
      </HotEnabler>
    );

    if (dest.hasChildNodes()) {
      ReactDOM.hydrate(element, dest);
    } else {
      ReactDOM.render(element, dest);
    }
  };

  hydrate(routes);

  // ==============================================================================================

  if (module.hot) {
    module.hot.accept('./routes', () => {
      const nextRoutes = require('./routes');
      hydrate(nextRoutes.__esModule ? nextRoutes.default : nextRoutes);
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > NO MODULE.HOT! <<<<<<<<<<<<<<');
  }

  // ==============================================================================================

  if (process.env.NODE_ENV !== 'production') {
    window.React = React;
  }

  // ==============================================================================================

  if (!__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > serviceWorker > new or updated content is available <<<<<<<<<<<<<');
              } else {
                console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > serviceWorker > content cached for offline use <<<<<<<<<<<<<');
              }
              break;
            case 'redundant':
              console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > serviceWorker > installed service worker redundant <<<<<<<<<<<<<');
              break;
            default:
              // ignore
          }
        };
      };
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > serviceWorker > Error registering service worker: ', error);
    }

    await navigator.serviceWorker.ready;
  } else {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ && serviceWorker in navigator NO!! <<<<<<<<<<<<<');
  }
})();

import React from 'react';
import ReactDOM from 'react-dom/server';
// import { Provider } from './components';
import { Provider } from 'react-redux';
import { Router, StaticRouter } from 'react-router';
import { createMemoryHistory } from 'history';
import { renderRoutes } from 'react-router-config';
import { getStoredState } from 'redux-persist'; 
import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage'; 
import { trigger } from 'redial';

import asyncMatchRoutes from './utils/asyncMatchRoutes';
import routes from './routes';
import configureStore from './redux/configureStore';
import initialStatePreloaded from './redux/initial-preloaded-state';
import { getUserAgent, isBot } from './utils/device';

import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
// import { flushFiles } from 'webpack-flush-chunks';

import Html from './helpers/Html';
import config from '../config/config';
import apiClient from './helpers/apiClient';
// import { createApp } from './app';

import { HelmetProvider } from 'react-helmet-async';

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------

const getRandomInt = (min, max) => (
  Math.floor(Math.random() * (max - min)) + min
)

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------

export default ({ clientStats }) => async (req, res) => {

  req.counter = getRandomInt(1, 100);
  req.userAgent = getUserAgent(req.headers['user-agent']);
  req.isBot = isBot(req.headers['user-agent']);

  // ----------------------------------

  const history = createMemoryHistory({ initialEntries: [req.originalUrl] });

  const preloadedState = initialStatePreloaded(req);

  const providers = {
    client: apiClient(req)
  };

  const store = configureStore({
    history,
    data: preloadedState,
    helpers: providers
  });

  function hydrate(a) {
    res.write('<!doctype html>');
    ReactDOM.renderToNodeStream(<Html assets={a} store={store} />).pipe(res);
  }

  try {

    const { components, match, params } = await asyncMatchRoutes(routes, req.path);

    // ===================================================================================================

    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    await trigger('fetch', components, triggerLocals);

    // ===================================================================================================

    const helmetContext = {};
    const context = {};

    const component = (
      <Provider store={store} {...providers}>
        <Router history={history}>
          <StaticRouter location={req.originalUrl} context={context}>
            <HelmetProvider context={helmetContext}>
              {renderRoutes(routes)}
            </HelmetProvider>
          </StaticRouter>
        </Router>
      </Provider>
    );

    const content = ReactDOM.renderToString(component);

    // ------------------------------------------------------------------------------------------------------

    const assets = flushChunks(clientStats, { chunkNames: flushChunkNames() });
    const status = context.status || 200;

    if (__DISABLE_SSR__) {
      return hydrate(assets);
    }

    // ===============================================================================
    // ===============================================================================

    if (context.url) {
      return res.redirect(301, context.url);
    }

    // ------------------------------------------------------------------------------------------------------

    const { location } = history;

    if (decodeURIComponent(req.originalUrl) !== decodeURIComponent(location.pathname + location.search)) {
      return res.redirect(301, location.pathname);
    }

    // ------------------------------------------------------------------------------------------------------

    const html = <Html assets={assets} store={store} content={content} />;

    const ssrHtml = `<!doctype html>${ReactDOM.renderToString(html)}`;

    res.status(200).send(ssrHtml);


  } catch (error) {
    res.status(500);
    hydrate(flushChunks(clientStats, { chunkNames: flushChunkNames() }));
  }
};

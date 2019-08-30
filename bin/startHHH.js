const fs = require('fs');
require('colors');
// const helmet = require('helmet');
const path = require('path');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const http = require('http');
// const httpProxy = require('http-proxy');
// const https = require('https');
const favicon = require('serve-favicon');
// const mongoose = require('mongoose');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');

const port = process.env.PORT || 8080;

const unhandledRejections = new Map();

process.on('unhandledRejection', (reason, promise) => {
  console.error('>>>>>>>> BIN > START > process > Unhandled Rejection at promise:', promise);
  console.error('>>>>>>>> BIN > START > process > Unhandled Rejection reason:', reason);
  unhandledRejections.set(promise, reason);
});

process.on('rejectionHandled', promise => {
  console.error('>>>>>>>> BIN > START > process > rejectionHandled > promise:', promise);
  unhandledRejections.delete(promise);
});

// const dbURL = config.mongoDBmongooseURL;
//
// const mongooseOptions = {
//   autoReconnect: true,
//   keepAlive: true,
//   connectTimeoutMS: 30000,
//   useNewUrlParser: true
// };

// const httpsOptions = {
//   key: fs.readFileSync(path.join(__dirname, '../ssl/localhost.key')),
//   cert: fs.readFileSync(path.join(__dirname, '../ssl/localhost.crt')),
//   requestCert: false,
//   rejectUnauthorized: false
// };

const app = express();
// const server = http.createServer(app);
// const server = https.createServer(httpsOptions, app);

app.set('port', port);
app.use(morgan('dev'));

// app.use(helmet());
// app.use(helmet.contentSecurityPolicy(config.app.csp));
// app.use(helmet.xssFilter());
// app.use(headers);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'build', 'favicon.ico')));

// ---------------------------------------------------------------------

// const targetUrl = `http://${config.apiHost}:${config.apiPort}`;

// const proxy = httpProxy.createProxyServer({
//   target: targetUrl,
//   ws: true
// });

// ---------------------------------------------------------------------

// app.use((req, res, next) => {
//   console.log('>>>>>>>>>>>>>>>>> START > app.use(res.setHeader(X-Forwarded-For) <<<<<<<<<<<<<<<<<<<<<<<');
//   res.setHeader('X-Forwarded-For', req.ip);
//   next();
// });

// // Proxy to API server
// app.use('/api', (req, res) => {
//   console.log('>>>>>>>>>>>>>>>>> START > app.use(/api) <<<<<<<<<<<<<<<<<<<<<<<');
//   proxy.web(req, res, { target: targetUrl });
// });
//
// app.use('/ws', (req, res) => {
//   console.log('>>>>>>>>>>>>>>>>> START > app.use(/ws) <<<<<<<<<<<<<<<<<<<<<<<');
//   proxy.web(req, res, { target: `${targetUrl}/ws` });
// });
//
// server.on('upgrade', (req, socket, head) => {
//   console.log('>>>>>>>>>>>>>>>>> START > proxy.on(error) <<<<<<<<<<<<<<<<<<<<<<<');
//   proxy.ws(req, socket, head);
// });
//
// proxy.on('error', (error, req, res) => {
//   console.log('>>>>>>>>>>>>>>>>> START > proxy.on(error) <<<<<<<<<<<<<<<<<<<<<<<');
//   if (error.code !== 'ECONNRESET') {
//     console.error('proxy error', error);
//   }
//   if (!res.headersSent) {
//     res.writeHead(500, { 'content-type': 'application/json' });
//   }
//
//   const json = {
//     error: 'proxy_error',
//     reason: error.message
//   };
//   res.end(JSON.stringify(json));
// });

// ---------------------------------------------------------------------

let isBuilt = false;

const done = () => !isBuilt
  && app.listen(app.get('port'), () => {
    isBuilt = true
    console.log('>>>>>>>> BIN > START > STATS COMPILER HAS COMPLETED BUILD !! WAIT IS OVER !');
    console.info('>>>>>>>> BIN > START > Express server Running <<<<<<<<<<');
  })

if (port) {
  console.log('>>>>>>>> BIN > START > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
  console.log('>>>>>>>> BIN > START > STATS COMPILER ATTEMPTING BUILD ! PLEASE WAIT ! ...');

  app.use(express.static(path.join(__dirname, '..', 'build')));

  if (__DEVELOPMENT__) {
    const clientConfigDev = require('../webpack/dev.client');
    const serverConfigDev = require('../webpack/dev.server');

    const { publicPath } = clientConfigDev.output;

    const serverOptions = {
      // lazy: false,
      stats: { colors: true },
      // serverSideRender: true,
      publicPath
      // writeToDisk: true
      // headers: { 'Access-Control-Allow-Origin': '*' }
    };

    app.use('/dlls/:dllName.js', (req, res, next) => {
      console.log('>>>>>>>>>>>>>>>>> START > app.use > DLLs <<<<<<<<<<<<<<<<<<<<<<<');
      /* eslint-disable max-len */
      fs.access(path.join(__dirname, '..', 'build', 'dlls', `${req.params.dllName}.js`), fs.constants.R_OK, err => err ? res.send(`################## NO DLL !!! (${req.originalUrl})') ##################`) : next());
    });

    const compiler = webpack([clientConfigDev, serverConfigDev]);

    const clientCompiler = compiler.compilers[0];
    // const serverCompiler = compiler.compilers[1];

    const devMiddleware = webpackDevMiddleware(compiler, serverOptions);
    app.use(devMiddleware);

    app.use((req, res, next) => {
      // const webpackStats = res.locals.webpackStats.toJson();
      // const clientStats = res.locals.webpackStats.toJson().children[0];
      next();
    });

    app.use(webpackHotMiddleware(clientCompiler));
    app.use(webpackHotServerMiddleware(compiler, { chunkName: 'server' }));

    devMiddleware.waitUntilValid(done);
  } else {
    const clientConfigProd = require('../webpack/prod.client');
    const serverConfigProd = require('../webpack/prod.server');

    webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
      if (err) {
        console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > err: ', err.stack || err);
        if (err.details) {
          console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > err.details: ', err.details);
        }
        return;
      }

      const clientStats = stats.toJson().children[0];

      if (stats.hasErrors()) {
        console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > stats.hasErrors: ', clientStats.errors);
      }
      if (stats.hasWarnings()) {
        console.warn('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > stats.hasWarnings: ', clientStats.warnings);
      }

      const serverRender = require('../build/server/server.js').default;

      // const serverRenderTest = require('../build/server/serverTest.js').default;
      // app.use(serverRenderTest({ clientStats }));

      app.use(serverRender({ clientStats }));

      done();
    });
  }
} else {
  console.error('>>>>>>>> BIN > START > Missing config.port <<<<<<<<<<<<<');
}

// MONGOOSE CONNECTION EVENTS

// mongoose.connection.on('connected', () => {
//   console.log(`>>>>>>>> BIN > START > Mongoose Connection: ${dbURL}`);
// });
//
// mongoose.connection.on('error', err => {
//   console.log(`>>>>>>>> BIN > START > Mongoose Connection error: ${err}`);
// });
//
// mongoose.connection.on('disconnected', () => {
//   console.log('>>>>>>>> BIN > START > Mongoose Connection disconnected');
// });
//
// // CLOSE MONGOOSE CONNECTION
//
// const gracefulShutdown = (msg, cb) => {
//   mongoose.connection.close(() => {
//     console.log(`>>>>>>>> BIN > START > Mongoose Connection closed through: ${msg}`);
//     cb();
//   });
// };

// #########################################################################

console.log('>>>>>>>>>>>>> BIN > START > Node > process.nextTick() > START <<<<<<<<<<<<<<<<');

process.nextTick(() => {
  console.log('>>>>>>>>>>>>> BIN > START > Node > process.nextTick() > nextTick CALLBACK <<<<<<<<<<<<<<<<<<<');
});

console.log('>>>>>>>>>>>>> BIN > START > Node > process.nextTick() > SCHEDULED <<<<<<<<<<<<');

// #########################################################################

const gracefulShutdown = (msg, cb) => {
  console.log(`>>>>>>>> BIN > START > Mongoose Connection closed through: ${msg}`);
  cb();
};

// listen for Node processes / events

// Node process is about to exit (called explicitly OR event loop has no additional work to perform)
process.on('exit', code => {
  console.log(`>>>>>>>> BIN > START > About to exit with code: ${code}`);
});

// exceptional conditions that are brought to user attention
process.on('warning', warning => {
  console.warn('>>>>>>>> BIN > START > Node process warning.name:', warning.name);
  console.warn('>>>>>>>> BIN > START > Node process warning.message:', warning.message);
  console.warn('>>>>>>>> BIN > START > Node process warning.stack:', warning.stack);
});

// listen to Node process for Signal Events

// Monitor App termination
process.on('SIGINT', m => {
  console.log('>>>>>>>> BIN > START > CHILD got Node process SIGINT message:', m);
  gracefulShutdown('app termination', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  });
});

// For nodemon restarts
process.once('SIGUSR2', m => {
  console.log('>>>>>>>> BIN > START > CHILD got Node process SIGUSR2 message:', m);
  gracefulShutdown('nodemon restart', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For Heroku app termination
process.on('SIGTERM', m => {
  console.log('>>>>>>>> BIN > START > CHILD got Node process SIGTERM message:', m);
  gracefulShutdown('Heroku app termination', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  });
});

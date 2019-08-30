const environment = {
  development: {
    isProduction: false,
    assetsPath: `http://${process.env.HOST || 'localhost'}:${+process.env.PORT || 3000}/dist`
  },
  production: {
    isProduction: true,
    assetsPath: '/dist'
  }
}[process.env.NODE_ENV || 'development'];

const config = {
  mongoDBmongooseURL: 'mongodb://localhost:27017/apptest2018',
  mongoDBsessionURL: 'mongodb://localhost:27017/apptest2018s',
  mongoLabURL: 'mongodb://localhost/apptest2018mlab',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || 3030,
  sessionSecret: process.env.SESSION_SECRET || 'gfvrfvbgfgfbfgbfgbfgbfgbgbgfb333',
  sessionExpiration: 6 * 60 * 60 * 1000, // 6 hours
  app: {
    head: {
      title: 'Election App 2019!',
      titleTemplate: 'ThisGreatApp!: %s',
      meta: [
        { name: 'description', content: 'The Midterms are here!' },
        { charset: 'UTF-8' },
        { property: 'og:site_name', content: 'ThisGreatApp!' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'ThisGreatApp!' },
        { property: 'og:description', content: 'The Midterms are here!' },
        { property: 'og:card', content: 'summary' },
        { property: 'og:site', content: 'dev' },
        { property: 'og:creator', content: 'dev' },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' }
      ]
    },
    csp: {
      directives: {
        'connect-src': [],
        'default-src': [],
        'manifest-src': [],
        'frame-src': [],
        'script-src': [],
        'style-src': [],
        'img-src': [],
        'font-src': [],
        'object-src': [],
        'block-all-mixed-content': true,
        'frame-ancestors': [],
      },
    },
  }
};

Object.assign(config, environment);
export default config;

const path = require('path');
const webpack = require('webpack');

const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const WebpackPwaManifest = require('webpack-pwa-manifest');

const rootPath = path.resolve(__dirname, '../');
const buildPath = path.resolve(rootPath, './build');
const assetPath = path.resolve(rootPath, './build/dist');

const data = Object.create(null);

const generatedIdent = (name, localName, lr) => {
  const r = Buffer.from(lr).toString('base64');
  return name + '__' + localName + '--' + r.substring( r.length-12, r.length-3 );
};

const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage, message, ...args);
};

// ==============================================================================================

module.exports = {

  context: path.resolve(__dirname, '..'),
  name: 'client',
  target: 'web',
  mode: 'production',

  entry: {
    main: [
      './src/theme/scss/bootstrap/bootstrap.global.scss',
      'bootstrap',
      './src/client.js',
    ]
  },

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: assetPath,
    publicPath: '/dist/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader:ExtractCssChunks.loader,
            options: {
              modules: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                  if (path.basename(loaderContext.resourcePath).indexOf('global.scss') !== -1) {
                    return localName;
                  } else {
                    return generatedIdent(path.basename(loaderContext.resourcePath).replace(/\.[^/.]+$/, ""), localName, loaderContext.resourcePath);
                  }
                },
                mode: 'local',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              // sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sourceMapContents: false,
              outputStyle: 'expanded'
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: true,
              resources: [
                path.resolve(rootPath, 'src/theme/scss/app/functions.scss'),
                path.resolve(rootPath, 'src/theme/scss/app/variables.scss'),
                path.resolve(rootPath, 'src/theme/scss/app/mixins.scss')
              ],
            },
          },
        ]
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader:ExtractCssChunks.loader,
            options: {
              modules: true
            }
          },
          {
            loader : 'css-loader',
            options: {
              modules: {
                getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                  if (path.basename(loaderContext.resourcePath).indexOf('global.scss') !== -1) {
                    return localName;
                  } else {
                    return generatedIdent(path.basename(loaderContext.resourcePath).replace(/\.[^/.]+$/, ""), localName, loaderContext.resourcePath);
                  }
                },
                mode: 'local',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              // sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
        },
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'image/svg+xml'
        }
      },
    ]
  },

  performance: {
    hints: false
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
          map: { 
            inline: false, 
            annotation: true
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-universal-component|react-hot-loader)[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      }
    },
    // runtimeChunk: true,
    // runtimeChunk: {
    //   name: 'assetManifest',
    // },
  },

  resolve: {
    modules: [ 'client', 'node_modules' ],
    extensions: ['.json', '.js', '.jsx'],
  },

  plugins: [

    new WebpackBar({ name: 'Client' }),
    // new WebpackAssetsManifest({ publicPath }),

    new CopyPlugin([
      { from: path.resolve(buildPath, './favicon.ico'), to: assetPath },
      { from: path.resolve(buildPath, './manifest.json'), to: assetPath },
      { from: path.resolve(buildPath, './launcher-icon-2x.png'), to: assetPath },
      { from: path.resolve(buildPath, './launcher-icon-3x.png'), to: assetPath },
      { from: path.resolve(buildPath, './launcher-icon-4x.png'), to: assetPath },
      { from: path.resolve(buildPath, './launcher-icon-5x.png'), to: assetPath },
    ]),

    // new WebpackPwaManifest({
    //   icons: [
    //     {
    //       src: path.resolve(buildPath, './launcher-icon-2x.png'),
    //       sizes: '96x96',
    //       type: 'image/png'
    //     },
    //     {
    //       src: path.resolve(buildPath, './launcher-icon-3x.png'),
    //       sizes: '144x144',
    //       type: 'image/png'
    //     },
    //     {
    //       src: path.resolve(buildPath, './launcher-icon-4x.png'),
    //       sizes: '192x192',
    //       type: 'image/png'
    //     }
    //   ],
    //   name: 'Applying thunk middleware for Redux',
    //   short_name: 'ElectionApp2019',
    //   start_url: '/',
    //   display: 'standalone',
    //   orientation: 'landscape',
    //   theme_color: '#87CEFF',
    //   background_color: '#87CEFF',
    //   // crossorigin: 'use-credentials'
    // }),

    new ExtractCssChunks({
      filename: '[name].[contenthash].css',
      // chunkFilename: '[name].[contenthash].chunk.css',
      // hot: false,
      // orderWarning: true,
      // reloadAll: true,
      // cssModules: true
    }),

    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),

    // '__DLLS__: false' : needed for SWPrecacheWebpackPlugin
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __DLLS__: false
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pwa.js',
      showErrors: true,
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      //   removeEmptyAttributes: true,
      //   removeStyleLinkTypeAttributes: true,
      //   keepClosingSlash: true,
      //   minifyJS: true,
      //   minifyCSS: true,
      //   minifyURLs: true,
      // },
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),

    new webpack.HashedModuleIdsPlugin(),

    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: '../../analyzers/bundleAnalyzer/prod.clientXXX2.html',
    //   openAnalyzer: false,
    //   generateStatsFile: false
    // }),

    // new DuplicatesPlugin({
    //   emitErrors: false,
    //   emitHandler: undefined,
    //   verbose: true
    // }),

    new GenerateSW({
      swDest: path.join(buildPath, 'service-worker.js'),
      clientsClaim: true,
      skipWaiting: true,
      importWorkboxFrom: 'local',
      navigateFallback: '/dist/index.html',
      runtimeCaching: [
        {
          urlPattern: /favicon\.ico/,
          handler: 'CacheFirst',
        },
        {
          urlPattern: /manifest\.json/,
          handler: 'CacheFirst',
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: 'CacheFirst',
        },
        {
          urlPattern: /json-data/,
          handler: 'NetworkFirst',
          options: {
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
      ],
    }),
  ],
};

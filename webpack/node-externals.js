const fs = require('fs');
const path = require('path');

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:

// externals property indicates code is available in the runtime environment

// https://webpack.js.org/configuration/externals/

const res = p => path.resolve(__dirname, p);
const nodeModules = res('../node_modules');
const externals = fs
	.readdirSync(nodeModules)
	.filter(x => !/\.bin|react-universal-component|webpack-flush-chunks/.test(x))
	.reduce((externals, mod) => {
		externals[mod] = `commonjs ${mod}`;
		return externals;
	}, {});
externals['react-dom/server'] = 'commonjs react-dom/server';

module.exports = externals;

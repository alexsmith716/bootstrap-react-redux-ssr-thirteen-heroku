import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

export default function({ clientStats }) {

  return function(req, res, next) {

    const method = req.method;
    const assets = flushChunks(clientStats, { chunkNames: flushChunkNames() });

    console.log(`>>>>>>>>>>>>>>>> serverTest > method: ${method}`);

    console.log(`>>>>>>>>>>>>>>>> serverTest > assets.publicPath: ${assets.publicPath}`);

    console.log(`>>>>>>>>>>>>>>>> serverTest > assets.stylesheets: ${assets.stylesheets}`);

    console.log(`>>>>>>>>>>>>>>>> serverTest > assets.scripts: ${assets.scripts}`);

    next();
  }
}

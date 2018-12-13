const path = require('path');
const { NODE_ENV = 'development'} = process.env;
module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'index.build.js'
  },
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
             '@babel/preset-react',
            ],
          }
        }
      }
    ]
  }
};

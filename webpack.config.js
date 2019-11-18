const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rule: [
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader',
        ],
      },
    ],
  },
};

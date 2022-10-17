const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/client/client.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      three: path.resolve('./node_modules/three')
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist/client')
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../assets/'),
          to: 'assets'
        }
      ]
    })
  ]
}

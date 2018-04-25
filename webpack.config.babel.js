import path from 'path'
import glob from 'glob'
import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import nodeExternals from 'webpack-node-externals'
const srcPath = path.resolve(__dirname, './src')
const distPath = path.resolve(__dirname, './public')
const publicSrcPath = path.join(srcPath, 'public')

function publicContents (srcExt, ext) {
  return glob.sync(`${publicSrcPath}/**/*${srcExt}`)
    .map((src) => path.relative(publicSrcPath, src))
    .reduce((prev, src) => {
      const dir = path.dirname(src)
      const name = path.basename(src, srcExt)
      const base = path.basename(src)
      return {
        ...prev,
        [path.format({ dir, name, ext })]: path.format({ dir: `./${dir}`, base })
      }
    }, {})
}

const contents = publicContents('.pug', '.html')

const pugLoader = [
  'apply-loader',
  'pug-loader',
]

const sassLoader = [
  {
    loader: 'css-loader',
    options: {
      minimize: true
    }
  },
  'sass-loader',
]

export default {
  context: publicSrcPath,
  entry: contents,
  output: {
    path: distPath,
    filename: '[name]',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ExtractTextPlugin.extract(pugLoader)
      },
      {
        test: /\.sass$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: sassLoader
          },
          {
            use: ExtractTextPlugin.extract(sassLoader)
          }
        ]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|templates/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new ExtractTextPlugin('[name]'),
    new CopyWebpackPlugin(
      [{ from: { glob: './assets/**/*', dot: true } }],
      { ignore: ['*.sass'] }
    ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  devServer: {
    contentBase: distPath,
    watchContentBase: true,
  },
}

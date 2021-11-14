//webpack开发配置文件
const path = require('path');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
// const AnalyzeWebpackPlugin = require('analyze-webpack-plugin').default
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    index: path.join(__dirname, "src/index.js"),
    mobile: path.join(__dirname, "src/mobile.js"),
  },
  output: {
    path: path.join(__dirname, "dist/"),
    filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkhash].js'
  },
  devtool: 'cheap-module-source-map',
  mode: "production",
  plugins: [
    // new HtmlWebpackPlugin({
    // filename: 'index.html',
    // template: path.join(__dirname, 'src/index.html')
    // }),
    // new AnalyzeWebpackPlugin(), // 默认生成 analyze.html
    new UglifyJSPlugin()
  ],
  //module-name-alias-setting
  resolve: {
    alias : {
      pages: path.join(__dirname, 'src/pages'),
      component: path.join(__dirname, 'src/component'),
      component_mobile: path.join(__dirname, 'src/component_mobile'),
      router: path.join(__dirname, 'src/router'),
      store: path.join(__dirname, 'src/store'),
      actions: path.join(__dirname, 'src/redux/actions'),
      reducers: path.join(__dirname, 'src/redux/reducers'),
    }
  },
  module: {
    rules: [
      {
         /*src文件夹下面的以.js结尾的文件，要使用babel解析*/
         /*cacheDirectory是用来缓存编译结果，下次编译加速*/
        test: /\.js?$/,
        use: ['babel-loader?cacheDirectory=true'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(css)$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }]
      },
      {
        test: /\.(less)$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "less-loader" // compiles Less to CSS
        }]
      },
      {
        test: /\.(png|jpg|gif|ttf|TTF)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'media/[name].[hash:8].[ext]',
            },
          }
        ]
      }, 
      {
        test: /\.(mp3|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              name: 'media/[name].[ext]',
            },
          }
        ]
      },   
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      }
    ]
  }
}
//webpack开发配置文件
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// const AnalyzeWebpackPlugin = require('analyze-webpack-plugin').default

module.exports = {
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, "src/index.js")
  ],
  output: {
    path: path.join(__dirname, "dist/"),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  devtool: 'inline-source-map',
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(__dirname, 'src/index.html')
    }),
    // new AnalyzeWebpackPlugin(), // 默认生成 analyze.html
  ],
  //webpack-dev-server
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port:4000,
    host:"10.76.0.160",
    historyApiFallback: true,
    proxy: {
      "/api": "http://10.76.0.160:4000"
    }
  },
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
              name: 'media/[name].[hash:8].[ext]',
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
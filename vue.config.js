const path = require('path')
const labConfig = require('./lab-config')

process.env.VUE_APP_LAB_NAME = labConfig.title
process.env.VUE_APP_LAB_DESCRIPTION = labConfig.description
process.env.VUE_APP_LAB_BASE = '//labs.minutelabs.io/' + labConfig.repo

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? `/${labConfig.repo}/`
    : '/'
  , configureWebpack: {
    resolve: { symlinks: false }
    , node: {
      __dirname: true
    }
    , plugins: [

  	]
    , output: {
      globalObject: 'this'
    }
    , module: {
      rules: [
        {
          test: /\.ya?ml$/,
          use: [
            'json-loader'
          ]
        }
      //   , {
      //     test: /\.js$/
      //     , use: [
      //       'comlink-loader'
      //     ]
      //     , include: [ path.resolve(__dirname, 'src/workers') ]
      //   }
      ]
    }
  }
  , css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        data: `@import '@/styles/_variables.scss'`
      }
    }
  }
}

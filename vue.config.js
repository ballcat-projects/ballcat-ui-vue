const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const projectConfig = require('./src/config/projectConfig')

// 预览环境的服务端地址，没有启动后端时，可以通过此地址进行前端查看
// const serverAddress = 'http://admin.ballcat.cn'
const serverAddress = 'http://ballcat-admin:8080'

function resolve(dir) {
  return path.join(__dirname, dir)
}

/**
 * 判断当前是否是生产环境
 * @returns {boolean}
 */
function isProd() {
  return process.env.NODE_ENV === 'production'
}

// 页面标题
const name = projectConfig.projectTitle


// cdn 前缀，免费的 cdn 有 unpkg 和 jsdelivr
// 注意：免费 cdn 不稳定，建议生成使用付费 cdn，或者使用 oss 地址
const cndPrefix = 'unpkg.com'
// const cndPrefix = 'cdn.jsdelivr.net/npm'

const assetsCDN = {
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    `//${cndPrefix}/vue@2.6.12/dist/vue.min.js`,
    `//${cndPrefix}/vue-router@3.5.1/dist/vue-router.min.js`,
    `//${cndPrefix}/vuex@3.6.2/dist/vuex.min.js`,
    `//${cndPrefix}/axios@0.21.1/dist/axios.min.js`
  ]
}

// webpack build externals
const prodExternals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios'
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // if prod is on, add externals
    externals: isProd() ? prodExternals : {}
  },

  chainWebpack: (config) => {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')


    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd()) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })

      // 内联 Manifest
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end()

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // 只打包初始时依赖的第三方
          },
          antDesignVue: {
            name: 'chunk-AntDesignVue', // 单独将 AntDesignVue 拆包
            priority: 20,  // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
            test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // 可自定义拓展你的规则
            minChunks: 3, //  // 最小共用次数
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    }
  },

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // less vars，customize ant design theme
            // 'primary-color': '#F5222D',
            // 'link-color': '#F5222D',
            'text-color': 'rgba(0, 0, 0, 0.85)', // 主文本色
            'border-radius-base': '2px', // 按钮圆角
            'layout-header-height': '48px', // layout 头高度
            'menu-collapsed-width': '48px' // inline 菜单收起宽度
          },
          javascriptEnabled: true
        }
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '^/api': {
        target: serverAddress,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: !isProd(),
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

if (projectConfig.enableLayoutSetting) {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig

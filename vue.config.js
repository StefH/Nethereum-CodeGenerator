/* eslint-disable no-useless-escape */
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/Nethereum-CodeGenerator/' : '/',
  pluginOptions: {
    quasar: {
      theme: 'mat',
      importAll: true,
    },
  },
  transpileDependencies: [/[\\\/]node_modules[\\\/]quasar-framework[\\\/]/],
  chainWebpack: (config) => {
    config.module
      .rule('ejs')
      .test(/\.ejs$/)
      .use('@testerum/ejs-compiled-loader-webpack4-nodeps')
      .loader('@testerum/ejs-compiled-loader-webpack4-nodeps')
      .end();
  },
};

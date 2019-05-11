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
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
};

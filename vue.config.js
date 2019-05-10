/* eslint-disable no-useless-escape */
module.exports = {
  pluginOptions: {
    quasar: {
      theme: 'mat',
      importAll: true,
    },
  },
  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar-framework[\\\/]/,
  ],
  chainWebpack: (config) => {
    config.module
      .rule('ejs')
      .test(/\.ejs$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
};

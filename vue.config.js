
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            },
            '/ms': {
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            // .set('style', resolve('src/assets/style'))
    },
    pwa:{
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
          }
    }
}
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
      createProxyMiddleware('/extension', {
          target: 'http://125.128.10.133:8080',
          changeOrigin: true
      })
  )
};
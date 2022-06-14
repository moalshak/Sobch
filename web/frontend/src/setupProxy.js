const { createProxyMiddleware } = require('http-proxy-middleware');
/**
 * This sets up the proxy that allows the front end to talk to the backend
 * */
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};
/* eslint-disable no-console */
const { createServer } = require('http');
const next = require('next');
const { parse } = require('url');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });
const {
  setupWSConnection,
  // setPersistence,
  // docs,
} = require('y-websocket/bin/utils');
// const persisitance = require('./store').persistence;

// setPersistence(persisitance);
wss.on('connection', setupWSConnection);

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const nextUpgradeHandler = app.getUpgradeHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    // eslint-disable-next-line consistent-return
    .on('upgrade', (request, socket, head) => {
      // You may check auth of request here..
      // See https://github.com/websockets/ws#client-authentication
      /**
       * @param {any} ws
       */
      const { pathname } = parse(request.url || '/', true);
      // Make sure we all for hot module reloading
      if (pathname === '/_next/webpack-hmr') {
        return nextUpgradeHandler(request, socket, head);
      }

      const handleAuth = (ws) => {
        wss.emit('connection', ws, request);
      };
      wss.handleUpgrade(request, socket, head, handleAuth);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

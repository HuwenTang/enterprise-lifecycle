const http = require('http');
const net = require('net');

const upstream = 'http://127.0.0.1:8000';
const upstreamHost = '127.0.0.1';
const upstreamPort = 8000;
const assetLike = (url) =>
  url === '/' ||
  /^\/(umi|__umi|favicon|scripts|icons|img|mg|static|assets|mock|api|system-api|prime-api|file|tmp|openapi|zsxt-api)\b/.test(url) ||
  /\.[a-zA-Z0-9]{2,8}(\?|$)/.test(url);

const server = http
  .createServer(async (req, res) => {
    try {
      const targetPath = assetLike(req.url || '/') ? req.url || '/' : '/';
      const init = { method: req.method, headers: req.headers };
      if (!['GET', 'HEAD'].includes(req.method || 'GET')) init.body = req;

      const response = await fetch(upstream + targetPath, init);
      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });
      const body = Buffer.from(await response.arrayBuffer());
      res.end(body);
    } catch (error) {
      res.statusCode = 502;
      res.end(String((error && error.stack) || error));
    }
  });

server.on('upgrade', (req, socket, head) => {
  const upstreamSocket = net.connect(upstreamPort, upstreamHost, () => {
    upstreamSocket.write(
      [
        `${req.method} ${req.url} HTTP/${req.httpVersion}`,
        ...Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`),
        '',
        '',
      ].join('\r\n'),
    );
    if (head?.length) upstreamSocket.write(head);
    socket.pipe(upstreamSocket);
    upstreamSocket.pipe(socket);
  });

  upstreamSocket.on('error', (error) => {
    if (!socket.destroyed) socket.end(`HTTP/1.1 502 Bad Gateway\r\n\r\n${String(error.message || error)}`);
  });
  socket.on('error', () => {
    upstreamSocket.destroy();
  });
});

server.on('clientError', (_error, socket) => {
  if (!socket.destroyed) socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(8001, '0.0.0.0', () => console.log('history fallback proxy http://localhost:8001'));

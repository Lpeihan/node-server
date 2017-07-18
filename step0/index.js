const http = require('http');

const server = http.createServer(function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  res.write('<html><head><meta charset="utf-8"/></head>');
  res.write('<body><h1>Hello Node Server !</h1><body>');
  res.end('</html>');
});

server.listen(8888);

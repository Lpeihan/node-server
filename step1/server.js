const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');


function staticRoot(staticPath, req, res) {
  let pathname = url.parse(req.url).pathname;


  if (pathname === '/') {
    pathname += 'index.html';
  }

  const filePath = path.join(staticPath, pathname);

  // 用同步方法会阻塞，且错误时整个服务器会挂掉
  /*
    const file = fs.readFileSync(filePath,'binary');
    res.write(file, 'binary');
    res.end();
  */

  fs.readFile(filePath, 'binary', function(err, file) {
    if (err) {
      res.writeHead(404, 'not found');
      res.end('<h1>404 Not Found</h1>');
    } else {
      res.write(file, 'binary');
      res.end();
    }
  });
}

const server = http.createServer(function(req, res) {
  staticRoot(path.resolve(__dirname, 'static'), req, res);
});

server.listen(8080);
console.log('visit http://localhost:8080');

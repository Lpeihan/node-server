const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

const routes = {
  '/a': function(req, res) {
    res.end('match /a, query is:' + JSON.stringify(req.query));
  },
  '/b': function(req, res) {
    res.end('match /b');
  },
  '/a/c': function(req, res) {
    res.end('match /a/c');
  },
  '/search': function(req, res) {
    res.end('username=' + req.body.username + ',password=' + req.body.password);
  }
};

const server = http.createServer(function(req, res) {
  rootPath(req, res);
});

server.listen(8080);
console.log('visit http://localhost:8080');

function rootPath(req, res) {
  const pathObj = url.parse(req.url, true);

  const handleFn = routes[pathObj.pathname];

  if (handleFn) {
    req.query = pathObj.query;

    //参考 https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
    // post json 解析
    let body = '';

    req.on('data', function(chunk) {
      body += chunk;
    }).on('end', function() {
      req.body = parseBody(body);
      handleFn(req, res);
    });
  } else {
    staticRoot(path.resolve(__dirname, 'static'), req, res);
  }
}


function staticRoot(staticPath, req, res) {
  let pathname = url.parse(req.url).pathname;


  if (pathname === '/') {
    pathname += 'index.html';
  }

  const filePath = path.join(staticPath, pathname);


  fs.readFile(filePath, 'binary', function(err, file) {
    if (err) {
      res.writeHead(404, 'not found');
      res.end('<h1>404 Not Found</h1>');
    }

    res.writeHead(200, 'Ok');
    res.write(file, 'binary');
    res.end();
  });
}

function parseBody(body) {
  const obj = {};
  body.split('&').forEach(function(str) {
    obj[str.split('=')[0]] = str.split('=')[1];
  });

  return obj;
}

const url = require('url');
const fs = require('fs');
const path = require('path');


function express() {
   const tasks = [];

  const app = function(req, res) {
    makeQuery(req);
    makeResponse(res);

    let i = 0;

    function next() {
      const task = tasks[i++];

      if (!task) {
        return;
      }

      if(task.routePath === null || url.parse(req.url, true).pathname === task.routePath) {
        task.middleWare(req, res, next);
      } else {
        next();
      }
    }
    next();
  }

  app.use = function(routePath, middleWare) {
    if (typeof routePath === 'function') {
      middleWare = routePath;
      routePath = null;
    }

    tasks.push({
      routePath: routePath,
      middleWare: middleWare
    });
  };

  return app;
}

express.static = function(staticPath) {
  return function(req, res, next) {
    const pathObj = url.parse(req.url, true);
    const filePath = path.resolve(staticPath, pathObj.pathname.substr(1));

    fs.readFile(filePath, 'binary', function(err, content) {
      if (err) {
        next();
      } else {
        res.writeHead(200, 'Ok');
        res.write(content, 'binary');
        res.end();
      }
    })
  }
}

module.exports = express;


function makeQuery(req) {
  const pathObj = url.parse(req.url, true);
  req.query = pathObj.query;
}

function makeResponse(res) {
  res.send = function(toSend) {
    if (typeof toSend === 'string') {
      res.end(toSend);
    }
    if (typeof toSend === 'object') {
      res.end(JSON.stringify(toSend));
    }
    if (typeof toSend === 'number') {
      res.writeHead(toSend, arguments[1]);
      res.end();
    }
  }
}

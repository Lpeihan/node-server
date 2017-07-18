#!/usr/bin/env node

const app = require('../app')
const http = require('http')

http.createServer(app).listen(8080);
console.log('open http://localhost:8080');

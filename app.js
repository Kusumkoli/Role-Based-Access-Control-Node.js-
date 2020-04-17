const http = require('http');

const express = require('express');
const app = express();

const loginController = require('./controllers/controller');

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.get('/', loginController.getLoginPage);

server.listen(2000);
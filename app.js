const http = require('http');

const express = require('express');
const app = express();

const userController = require('./controllers/controller');

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.get('/', userController.getLogin);

app.get('/signup', userController.getSignup);

app.get('/admin-signin', userController.getAdminSignIn);

server.listen(2000);
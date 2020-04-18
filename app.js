// const http = require('http');

// const express = require('express');
// const app = express();

// const userController = require('./controllers/controller');

// const server = http.createServer(app);


// app.get('/', userController.getLogin);

// app.get('/signup', userController.getSignup);

// app.get('/admin-signin', userController.getAdminSignIn);

// server.listen(2000);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const User = require('./models/user-model')
const routes = require('./routes/route');
 
require("dotenv").config({
 path: path.join(__dirname, "./.env")
});
 
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 2000;
 
mongoose
 .connect('mongodb+srv://kusumkoli:eJL107UOgWaBZyaq@cluster0-h9zxf.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => {
  console.log('Connected to the Database successfully');
 });

console.log(process.env.JWT_SECRET);
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(async (req, res, next) => {
 if (req.headers["x-access-token"]) {
  const accessToken = req.headers["x-access-token"];
  const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
  // Check if token has expired
  if (exp < Date.now().valueOf() / 1000) { 
   return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
  } 
  res.locals.loggedInUser = await User.findById(userId); next(); 
 } else { 
  next(); 
 } 
});
 
app.use('/', routes); 

app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})

app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
       error: "JWT token has expired, please login to obtain a new one"
      });
     }
     res.locals.loggedInUser = await User.findById(userId);
     next();
    } else {
     next();
    }
  });
   
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



async function hashPassword(pw) {
    return await bcrypt.hash(pw, 10);
};

async function validatePassword(plainPW, hashedPW) {
    return await bcrypt.compare(plainPW, hashedPW);
};

var adminAccount = new User({email: 'admin1234@gmail.com', password: '$2b$10$DKm0pRbJPaNlCfCt1Y80Puo5e9mD2/LvPx4OejfYoosZR73p3wVgC', role: 'admin'});
adminAccount.save(function (err) {
    if (err) return console.log(err);
});


const { roles } = require('../roles')
 
exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.role)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}
 
exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
        return res.status(401).json({
            error: "You need to be logged in to access this route"
    });
    req.user = user;
    next();
    } catch (error) {
    next(error);
    }
}


exports.getSignup = (req, res, next) => {
    res.render('login', {pageTitle: 'Sign Up'});
};

exports.postSignup = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        const hashedPassword = await hashPassword(password);
        const newUser = new User({email, password: hashedPassword, role});
        const accessToken = jwt.sign({ userId: newUser._Id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        newUser.accessToken = accessToken;
        await newUser.save();
        console.log({ data: newUser, accessToken});
        res.render('dashboard', {pageTitle: 'Dashboard', data: newUser});
    } catch(err) {
        next(err);
    }
};

exports.getLogin = (req, res, next) => {
    res.render('login', {pageTitle: 'Sign In'});
};

exports.adminSignin = (req, res, next) => {
    res.render('login', {pageTitle: 'Admin Login'});
};

exports.login = async (req, res, next) => {
    try {
     const email = req.body.email;
     const password = req.body.password;
     const role = req.body.role;
     const user = await User.findOne({email});
     if (!user && role==='admin') return res.render('login', {pageTitle:'Admin Login', user: true});
     const validPassword = await validatePassword(password, user.password);
     if (!validPassword) return next(new Error('Password is not correct'))
     const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
     });
     await User.findByIdAndUpdate(user._id, { accessToken })
     console.log({
        data: { email: user.email, role: user.role },
        accessToken
       });
     res.status(200).render('dashboard', {pageTitle: 'Dashboard', data: { email: user.email, role: user.role },
     accessToken});
    } catch (error) {
     next(error);
    }
}

// exports.getAdminSignIn = (req, res, next) => {
//     res.render('login', {pageTitle: 'Admin Login'});
// };


exports.getUsers = async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
     data: users
    });
}
    
exports.getUser = async (req, res, next) => {
    try {
     const userId = req.params.userId;
     const user = await User.findById(userId);
     if (!user) return next(new Error('User does not exist'));
      res.status(200).json({
      data: user
     });
    } catch (error) {
     next(error)
    }
}
    
exports.updateUser = async (req, res, next) => {
    try {
     const update = req.body
     const userId = req.params.userId;
     await User.findByIdAndUpdate(userId, update);
     const user = await User.findById(userId)
     res.status(200).json({
      data: user,
      message: 'User has been updated'
     });
    } catch (error) {
     next(error)
    }
}
    
exports.deleteUser = async (req, res, next) => {
    try {
     const userId = req.params.userId;
     await User.findByIdAndDelete(userId);
     res.status(200).json({
      data: null,
      message: 'User has been deleted'
     });
    } catch (error) {
     next(error)
    }
}


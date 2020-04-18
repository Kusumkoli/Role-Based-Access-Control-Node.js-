const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


async function hashPassword(pw) {
    return await bcrypt.hash(pw, 10);
};

async function validatePassword(plainPW, hashedPW) {
    return await bcrypt.compare(plainPW, hashedPW);
};
    
exports.getSignup = (req, res, next) => {
    res.render('login', {pageTitle: 'Sign Up'});
};

exports.postSignup = async (req, res, next) => {
    try {
        const {email, password, role} = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = new User({email, password: hashedPassword, role: role || "user"});
        const accessToken = jwt.sign({ userId: newUser._Id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({ data: newUser, accessToken});
    } catch(err) {
        next(err);
    }
};

exports.getLogin = (req, res, next) => {
    res.render('login', {pageTitle: 'Login'});
};

exports.postLogin = async (req, res, next) => {
    try {
     const { email, password } = req.body;
     const user = await User.findOne({ email });
     if (!user) return next(new Error('Email does not exist'));
     const validPassword = await validatePassword(password, user.password);
     if (!validPassword) return next(new Error('Password is not correct'))
     const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
     });
     await User.findByIdAndUpdate(user._id, { accessToken })
     res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken
     });
     res.render('dashboard', {pageTitle: 'Dashboard'});
    } catch (error) {
     next(error);
    }
}

exports.getAdminSignIn = (req, res, next) => {
    res.render('login', {pageTitle: 'Admin Login'});
};


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
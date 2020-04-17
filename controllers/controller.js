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

exports.getAdminSignIn = (req, res, next) => {
    res.render('login', {pageTitle: 'Admin Login'});
};
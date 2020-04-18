const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller');
 
router.get('/signup', userController.getSignup);

router.post('/signup', userController.postSignup);
 
router.post('/login', userController.login);
 
router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);
 
router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);
 
router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
 
router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.get('/', userController.getLogin);
 
module.exports = router;
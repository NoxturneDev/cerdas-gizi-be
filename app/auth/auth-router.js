const router = require('express').Router();
const AuthController = require('./auth-controller');

console.log(AuthController);
router.post('/login', AuthController.loginUser);
router.post('/register', AuthController.registerUser);
router.post('/logout', AuthController.logoutUser);

module.exports = router;

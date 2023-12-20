const router = require('express').Router();
const userController = require('./user-controller');

// todo: create logout routes, make it all work
router.post('/api/logout', userController.logout);
router.post('/api/login', userController.login);
router.post('/api/register', userController.registerUser);

router.get('/api/user', userController.getAllUsers);

module.exports = router;

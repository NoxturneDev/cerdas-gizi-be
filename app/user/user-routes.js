const router = require('express').Router();
const userController = require('./user-controller');

router.get('/v1/user', userController.getAllUsers);

module.exports = router;

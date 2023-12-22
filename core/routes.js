const express = require('express');

const router = express.Router();
const promptRouter = require('../app/prompt/prompt-routes');
const userRouter = require('../app/user/user-routes');
const imageRouter = require('../app/image/image-routes');
const { authentication } = require('../app/services/auth-service');
const userController = require('../app/user/user-controller');

// auth routes
router.post('/logout', userController.logoutUser);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

router.use('/v1', async (req, res, next) => { await authentication(req, res, next); });

router.use(promptRouter);
router.use(userRouter);
router.use(imageRouter);

router.get('/api/check', async (req, res) => res.status(200).json({
  message: 'Server is good to go now, 🚀 berkat ashue fahmi ashue',
}));

module.exports = router;

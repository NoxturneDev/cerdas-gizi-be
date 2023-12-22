const express = require('express');

const router = express.Router();
const authRouter = require('../app/auth/auth-router');
const promptRouter = require('../app/prompt/prompt-routes');
const userRouter = require('../app/user/user-routes');
const { authentication } = require('../app/services/auth-service');
// const userController = require('../app/user/user-controller');

// auth routes

router.use(authRouter);
router.use('/v1', async (req, res, next) => {
  await authentication(req, res, next);
});

router.use(promptRouter);
router.use(userRouter);

router.get('/api/check', async (req, res) => res.status(200).json({
  message: 'Server is good to go now, 🚀 berkat ashue fahmi ashue',
}));

module.exports = router;

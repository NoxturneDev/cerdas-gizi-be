const express = require('express');
const router = express.Router();
const promptRouter = require('../app/prompt/prompt-routes');
const userRouter = require('../app/user/user-routes');

router.use(promptRouter);
router.use(userRouter);

router.get('/api/check', async (req, res) => {
  return res.status(200).json({
    message: "Server is good to go now, 🚀 berkat ashue fahmi ashue",
  })
})

module.exports = router;

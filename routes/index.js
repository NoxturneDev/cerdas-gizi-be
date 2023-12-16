const express = require('express');
const router = express.Router();
const PromptRouter = require('./prompt');

router.use(PromptRouter);

router.get('/api/check', async (req, res) => {
  return res.status(200).json({
    message: "Server is good to go now, 🚀 berkat ashue fahmi ashue",
  })
})

module.exports = router;

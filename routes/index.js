const express = require('express');
const router = express.Router();

router.get('/api/check', async (req, res) => {
  return res.status(200).json({
    message: "Server is good to go",
  })
})

module.exports = router;

const router = require('express').Router();
const PromptController = require('../controller/prompt-controller');

router.post('/api/prompt/image', PromptController.scanImage);

module.exports = router;

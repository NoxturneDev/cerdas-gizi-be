const router = require('express').Router();
const imageHandler = require('../lib/imageHandler');
const PromptController = require('./prompt-controller');

router.post('/api/prompt/image', imageHandler.upload.single('file'), PromptController.scanImage);

module.exports = router;

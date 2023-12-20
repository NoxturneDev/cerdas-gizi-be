const router = require('express').Router();
const imageHandler = require('../services/imageHandler');
const PromptController = require('../controller/prompt-controller');

router.post('/api/prompt/image', imageHandler.upload.single('file'), PromptController.scanImage);

module.exports = router;

const router = require('express').Router();
const imageController = require('./image-controller');
const upload = require('../lib/imageHandler');

router.post('/v1/scan-image', upload.upload.single('file'), imageController.scanImage);

module.exports = router;

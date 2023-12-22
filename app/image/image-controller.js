const imageService = require('./image-service');

// eslint-disable-next-line consistent-return
async function scanImage(req, res) {
  try {
    const saveImageToLocal = imageService.saveToLocalDir(req);

    if (saveImageToLocal.error) {
      return res.status(saveImageToLocal.error.statusCode).json({
        status: 'failed',
        message: saveImageToLocal.error.message,
        users: {},
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'success saving image to directory',
      // users: user,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { scanImage };

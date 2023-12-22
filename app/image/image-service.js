const sharp = require('sharp');
const { ApiError } = require('../lib/Error');

async function saveToLocalDir(req) {
  // const directory = './public/data/uploads/';
  const saveImageToLocal = await sharp(`./public/data/uploads/${req.file.filename}`).resize({
    widht: 250,
    height: 250,
  }).toFile('./public/data/tmp/image/test-2.jpg');

  // console.log(saveImageToLocal);
  //
  // return saveImageToLocal;
}

module.exports = { saveToLocalDir };

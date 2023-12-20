const multer = require('multer');

const upload = multer({dest: './public/data/uploads/'});

module.exports = {upload};





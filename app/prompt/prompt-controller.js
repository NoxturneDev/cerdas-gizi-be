const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function scanImage(req, res) {
  const { body } = req;
  // const imageBuffer = Buffer.from([req.file]).toString('base64');

  // if (!req.file || req.file?.filename) {
  //   return res.status(400).json({
  //     message: 'file not found',
  //     status: 'FAILED',
  //   });
  // }
  try {
    const buffer = Buffer.from(fs.readFileSync(`./public/data/uploads/${req.file?.filename}`)).toString('base64');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

    const imageData = {
      inlineData: {
        data: buffer,
        mimeType: 'image/webp',
      },
    };

    const imageModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    const imageModelGenerate = await imageModel.generateContent([body?.prompt, imageData]);
    const { totalTokens } = await imageModel.countTokens([body?.prompt, imageData]);
    //
    const result = await imageModelGenerate.response;
    const text = result.text();

    return res.status(200).json({
      message: 'message',
      status: 'OK',
      genAIresponse: text,
      tokens: totalTokens,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message,
      status: 'FAILED',
    });
  }
}

module.exports = {
  scanImage,
};

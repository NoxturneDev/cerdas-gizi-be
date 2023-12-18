const {GoogleGenerativeAI} = require("@google/generative-ai");
const fs = require("fs");

async function scanImage(req, res) {
  const {body} = req;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

  // const model = genAI.getGenerativeModel({model: 'gemini-pro'});
  // const prompt = req.body.question;

  // const result = await model.generateContent(prompt);
  // const response = await result.response;
  // const text = response.text();

  const imageData = {
    inlineData: {
      data: Buffer.from(fs.readFileSync('./test-3.jpeg')).toString('base64'),
      mimeType: 'image/jpeg',
    },
  };

  const imageModel = genAI.getGenerativeModel({model: 'gemini-pro-vision'});
  const imageModelGenerate = await imageModel.generateContent([body?.prompt, imageData]);

  const result = await imageModelGenerate.response;
  const text = result.text();

  console.log("result: ", text);
  try {
    return res.status(200).json({
      message: 'message',
      status: 'OK',
      genAIresponse: text,
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  scanImage,
}

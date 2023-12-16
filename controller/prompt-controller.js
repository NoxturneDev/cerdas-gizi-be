const { GoogleGenerativeAI } = require("@google/generative-ai");

async function scanImage(req, res) {
  // const imageBuffer = Buffer.from(req.body.file.content).toString('base64');

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

  const model = genAI.getGenerativeModel({model: 'gemini-pro'});
  const prompt = req.body.question;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  //
  // const imageData =
  //     inlineData: {
  //       data: imageBuffer,
  //       mimeType
  //     },
  //   };
  // }


  try {
    return res.status(200).json({
      message: 'message',
      status: 'OK',
      genAIresponse: text,
    })
  } catch(error) {
    console.log(error);
  }
}

module.exports = {
  scanImage,
}

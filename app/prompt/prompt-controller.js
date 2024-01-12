const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

function replaceParameters(promptDesign, replacements) {
  return Object.entries(replacements).reduce((result, [parameter, data]) => {
    const regex = new RegExp(`#${parameter}#`, 'g');
    return result.replace(regex, data);
  }, promptDesign);
}

async function scanImage(req, res) {
  const { body } = req;
  try {
    const buffer = Buffer.from(fs.readFileSync(`./public/data/uploads/${req.file?.filename}`)).toString('base64');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

    const imageData = {
      inlineData: {
        data: buffer,
        mimeType: 'image/webp',
      },
    };

    const rawPrompt = body.prompt;
    const promptDesignBase = 'send the response in JSON (no need to add json as a prefix for the answer) with object of : advice, nutritions fact (object), children data (name, age). response in BAHASA INDONESIA. this is the prompt: Hi, i WANT you to act like my private nutritionist and give me some healthy advice according to food and nutrients. First of all, my kid is at #age# and his name is #name#. I wanted to give him this food at the picture. and this is the further description about it. #prompt#. please also write some advice is this food is recommended based on the nutrition. Im concerned about stunting issue, so I want my children to be as healthy as possible.';

    const replacements = {
      prompt: rawPrompt,
      name: 'Galih Adhi kusuma',
      age: 9,
    };

    const finalPrompt = replaceParameters(promptDesignBase, replacements);

    const imageModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    const imageModelGenerate = await imageModel.generateContent([finalPrompt, imageData]);
    const { totalTokens } = await imageModel.countTokens([finalPrompt, imageData]);

    const result = await imageModelGenerate.response;
    const text = result.text();

    return res.status(200).json({
      message: 'message',
      status: 'OK',
      data: text,
      tokens: totalTokens,
      prompt: finalPrompt,
      // jsonFormat: JSON.parse(text),
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

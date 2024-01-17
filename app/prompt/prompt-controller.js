const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const { text } = require('body-parser');

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

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

    const imageData = {
      inlineData: {
        data: buffer,
        mimeType: 'image/webp',
      },
    };

    const userPrompt = body.prompt;
    const promptDesignBase = 'Hi, I want you to act like my private nutritionist. But you need to send the response in JSON (no need to add json as a prefix for the answer) with object of : advice, nutritions fact (object), children data (name, age). Give me some healthy advice according to food and nutrients. First of all, my kid is at #age# and his name is #name#. I wanted to give him this food at the picture. and this is the further description about it. #prompt#. please also write some advice is this food is recommended based on the nutrition. Im concerned about stunting issue, so I want my children to be as healthy as possible. and please translate in Bahasa Indonesia';

    const replacements = {
      prompt: userPrompt,
      name: 'Galih Adhi kusuma',
      age: 9,
    };

    const finalPrompt = replaceParameters(promptDesignBase, replacements);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const imageModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' }); const imageModelGenerate = await imageModel.generateContent([finalPrompt, imageData]);
    const { totalTokens } = await imageModel.countTokens([finalPrompt, imageData]);

    const result = await imageModelGenerate.response;
    const text = result.text();

    return res.status(200).json({
      message: 'message',
      status: 'OK',
      data: text,
      tokens: totalTokens,
      prompt: finalPrompt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message,
      status: 'FAILED',
    });
  }
}

async function recipeGenerator(req, res) {
  try {
    const { body } = req;
    const promptDesignBase = 'Hi, I want you to act like my private nutritionist. And i come from indonesia and i am a low middle income class. But you need to send the response in JSON (no need to add json as a prefix for the answer). Saya ingin membuat masakan tapi saya butuh ide Anda untuk memberikan ide resep yang ada sesuai dengan ketentuan dibawah ini. Jumlah resep #amount#. Dengan harga #price#, bahan-bahan: #ingredients#. example of response: {resep: [{nama: sup, bahan: "kentang, sosis", waktu: "50 menit", langkah: ["1. goreng ikan"]}, without ``` at the beginning or in the ending.';
    const parameters = {
      ingredients: null,
      goals: null,
      category: null,
      price: null,
      vegan: null,
      amount: null,
      ...body,
    };

    const finalPrompt = replaceParameters(promptDesignBase, parameters);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const textModelGenerate = await textModel.generateContent(finalPrompt);
    const { totalTokens } = await textModel.countTokens(finalPrompt);

    const result = await textModelGenerate.response;

    return res.status(200).json({
      message: 'success',
      response: JSON.parse(result.text()),
      userPrompt: finalPrompt,
      param: parameters,
      token: totalTokens,
      status: 'OK',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message,
      status: 'FAILED',
    });
  }
}

async function BMIChecker() {

}

module.exports = {
  scanImage,
  recipeGenerator,
};

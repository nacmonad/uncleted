import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const styleOf = req.body.styleOf || '';
  if (styleOf.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid styleOf",
      }
    });
    return;
  }

  const maxTokens = req.body.maxTokens || process.env.MAX_TOKENS || 10;

  const temperature = req.body.temperature || process.env.TEMPERATURE_DEFAULT || 0;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateComplimentInStyleOf(styleOf),
      max_tokens: parseInt(maxTokens),
      //temperature: parseFloat(temperature).toFixed(2),
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generateComplimentInStyleOf(styleOf) {
  return `Say something nice to me in the style of ${styleOf}`;
}

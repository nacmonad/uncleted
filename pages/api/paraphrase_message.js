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

  const message = req.body.message || '';
  const style = req.body.style || '';

  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid location for a suggestion",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(message, style),
      max_tokens: 256,
      temperature: 0.6,
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

function generatePrompt(message, style) {
  return `
  I will supply a direct message addressed to {firstname}, which may also contain fields such as {lastname}, {location}, {company} which describe the addressee's lastname, location and company respectively. 
  
  Can you paraphrase this message :
  ##### begin message ######
  ${message}
  ##### end message #####  
  ${style ? "in the " + style + " style" : ""}`
  
}

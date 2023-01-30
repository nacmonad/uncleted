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

  const location = req.body.location || '';
  if (location.trim().length === 0) {
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
      prompt: generatePrompt(location),
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

function generatePrompt(location) {
  
  return `
  I like renaissance art, Leonardo Da Vinci and Roman archeology.

  I will prompt you with a location in text.  I need you to determine its' latitude & longitude, as well as any sites of archeological & historical significance that are in line what I like.
  The historical sites should be within a 100km radius.
  Return at most 3 historical sites.

  You'll respond in a JSON format with any relevant fields you can fill in.  The format is 
  {
    historical_sites: Array
  }

  The historical_sites array object itself has the JSON format: 
  historical_site {
    name: String,
    lat: Number,
    lon: Number
  }
  
  The response needs to be trimmed of newline characters '\n'

  Generate me the response for the input location: ${location}`;
}

import { Configuration, OpenAIApi } from "openai";

var x = 0;
var tokens = 150;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  if (x >= 1) {
    tokens = 400;
  }

  try {
    const { length, difficulty, location, goal } = req.body;
    const prompt = generatePrompt(length, difficulty, location, goal);
    console.log(prompt);
    console.log(tokens);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 500,
    });
    x += 1;
    res.status(200).json({ result: completion.data.choices[0].text });
    console.log("3");
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
      console.log("1");
    } else {
      console.log("2");
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(length, difficulty, location, goal) {
  return `Give me a ${length}, ${difficulty} difficulty workout plan to do today at ${location} with the goal to ${goal}. Provide sets/reps/durations and a brief description for each exercise. Write this in paragraphs. Remove numbered lists.
  `;
}
//npm run dev

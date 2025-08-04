// aiApi.js
import axios from 'axios';

export const queryOpenRouter = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': 'Bearer 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', // Replace with your actual key
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost', // or your deployed URL
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      console.error('OpenRouter: No choices in response', response.data);
      return 'Sorry, I couldn’t get a valid response.';
    }
  } catch (error) {
    console.error('OpenRouter Error:', error.response?.data || error.message);
    return 'Sorry, I couldn’t reach the AI.';
  }
};

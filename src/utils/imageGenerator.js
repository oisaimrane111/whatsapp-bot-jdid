const axios = require('axios');

const OPENAI_API_KEY = 'your-openai-api-key';  // Get your API key from OpenAI
const OPENAI_URL = 'https://api.openai.com/v1/images/generations';

/**
 * Function to generate an image from a prompt using OpenAI's DALL·E API
 * @param {string} prompt - The text prompt to generate the image
 * @param {number} n - Number of images to generate (default is 1)
 * @returns {Promise<string>} - URL of the generated image
 */
const generateImage = async (prompt, n = 1) => {
  try {
    const response = await axios.post(OPENAI_URL, {
      prompt: prompt,
      n: n,  // Number of images to generate
      size: '1024x1024',  // Image size (you can change this)
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Return the URL of the generated image
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0].url;
    } else {
      return 'No image generated. Try a different prompt!';
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return 'Error generating image!';
  }
};

module.exports = { generateImage };

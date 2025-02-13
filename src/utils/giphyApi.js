const axios = require('axios');
require('dotenv').config();  // Load environment variables from .env file

// Get the Giphy API key from environment variables
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;  // Use the API key stored in .env file
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs/search';

/**
 * Function to get a random GIF from Giphy based on a search term
 * @param {string} searchTerm - The search term for the GIF
 * @param {number} limit - Number of GIFs to fetch
 * @returns {Promise<Object>} - Promise containing the GIF's URL
 */
const getGiphyGif = async (searchTerm, limit = 1) => {
  try {
    const response = await axios.get(GIPHY_BASE_URL, {
      params: {
        api_key: GIPHY_API_KEY,
        q: searchTerm,
        limit: limit,
        rating: 'PG',  // Optional: Filter results for all audiences
      },
    });

    // Return the first result (you can modify this if you want to return more)
    if (response.data.data.length > 0) {
      return response.data.data[0].images.original.url;
    } else {
      return 'No GIFs found for your search term!';
    }
  } catch (error) {
    console.error('Error fetching Giphy GIF:', error);
    return 'Error fetching GIF!';
  }
};

module.exports = { getGiphyGif };


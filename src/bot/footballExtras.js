const giphyApi = require('../utils/giphyApi');

module.exports = {
    sendGif: async (sock, message, text) => {
        const searchQuery = text.split(' ')[1] || 'goal'; // Defaults to 'goal' if no query is provided
        try {
            const gifUrl = await giphyApi.getGif(searchQuery);
            await sock.sendMessage(message.key.remoteJid, {
                image: { url: gifUrl },
                caption: `🎥 Here's a GIF for "${searchQuery}"!`
            });
        } catch (error) {
            console.error('Failed to get GIF:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Failed to fetch GIF. Please try again later.'
            });
        }
    }
};

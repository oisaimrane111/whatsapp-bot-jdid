module.exports = {
    createTournament: async (sock, message, text) => {
        // Example - You can customize this later with database logic
        await sock.sendMessage(message.key.remoteJid, { text: '🏆 Tournament Created Successfully!' });
    },

    submitResult: async (sock, message, text) => {
        const parts = text.split(' ');
        if (parts.length < 3) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ Invalid format! Use: !result TeamA 3-1 TeamB' });
            return;
        }
        const resultInfo = parts.slice(1).join(' ');
        await sock.sendMessage(message.key.remoteJid, { text: `✅ Result Submitted: ${resultInfo}` });
    },

    showStandings: async (sock, message) => {
        // Example standings message (can later be replaced by data from DB)
        const standingsText = '📊 Standings:\n1. Team A - 9pts\n2. Team B - 6pts\n3. Team C - 3pts\n4. Team D - 0pts';
        await sock.sendMessage(message.key.remoteJid, { text: standingsText });
    }
};

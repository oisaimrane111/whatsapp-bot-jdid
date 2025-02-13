const tournamentService = require('./tournamentService');
const footballExtras = require('./footballExtras');

module.exports = async (sock, m) => {
    const message = m.messages[0];

    // Ensure the message is a text message and not from the bot itself
    if (!message.message || message.key.fromMe) return;

    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';

    if (text.startsWith('!createTournament')) {
        await tournamentService.createTournament(sock, message, text);
    } else if (text.startsWith('!result')) {
        await tournamentService.submitResult(sock, message, text);
    } else if (text.startsWith('!standings')) {
        await tournamentService.showStandings(sock, message);
    } else if (text.startsWith('!gif')) {
        await footballExtras.sendGif(sock, message, text);
    } else {
        await sock.sendMessage(message.key.remoteJid, { text: '⚽ Command not recognized! Try:\n\n!createTournament\n!result\n!standings\n!gif [query]' });
    }
};

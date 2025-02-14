const { default: makeWASocket, useSingleFileAuthState, MessageType } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { state, saveState } = useSingleFileAuthState('/data/auth_info.json');

const botCommands = `
⚽ *Football Bot Commands* ⚽

📜 *Menu* - Show this menu
🏆 *Create Tournament* (admin) - Create a new tournament
➕ *Add Team* (admin) - Add a team to the tournament
✅ *Submit Result* (admin) - Submit match result
👑 *Winner* (admin) - Declare tournament winner
📊 *Standings* - Show tournament standings
🧑‍💻 *Quiz* - Start player guessing quiz
🏅 *Leaderboard* - Show quiz leaderboard
`;

let tournament = { teams: [], results: [], winner: null };
let quizLeaderboard = {};

async function startBot() {
    const sock = makeWASocket({ auth: state });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const textMessage = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;
        const isAdmin = sender.includes('admin'); // Example check, replace with proper logic

        if (!textMessage) return;

        if (textMessage.startsWith('Menu')) {
            await sock.sendMessage(sender, { text: botCommands });
        }

        if (textMessage.startsWith('Create Tournament') && isAdmin) {
            tournament = { teams: [], results: [], winner: null };
            await sock.sendMessage(sender, { text: '🏆 Tournament created successfully!' });
        }

        if (textMessage.startsWith('Add Team') && isAdmin) {
            const teamName = textMessage.split(' ')[2];
            tournament.teams.push(teamName);
            await sock.sendMessage(sender, { text: `➕ Team ${teamName} added!` });
        }

        if (textMessage.startsWith('Submit Result') && isAdmin) {
            const [team1, team2, score1, score2] = textMessage.split(' ').slice(2);
            tournament.results.push({ team1, team2, score1, score2 });
            await sock.sendMessage(sender, { text: `✅ Result submitted: ${team1} ${score1} - ${score2} ${team2}` });
        }

        if (textMessage.startsWith('Winner') && isAdmin) {
            tournament.winner = textMessage.split(' ')[1];
            await sock.sendMessage(sender, { text: `👑 Winner declared: ${tournament.winner}` });
        }

        if (textMessage.startsWith('Standings')) {
            let standings = tournament.teams.join(', ');
            await sock.sendMessage(sender, { text: `📊 Teams: ${standings}` });
        }

        if (textMessage.startsWith('Quiz')) {
            await sock.sendMessage(sender, { image: fs.readFileSync('/data/player.jpg'), caption: '🧑‍💻 Who is this player?' });
        }

        if (textMessage.startsWith('Leaderboard')) {
            const leaderboardText = Object.entries(quizLeaderboard).map(([user, points]) => `${user}: ${points} 🏅`).join('\n');
            await sock.sendMessage(sender, { text: `🏆 Leaderboard:\n${leaderboardText}` });
        }

        // Example for guessing the player (adjust logic as needed)
        if (textMessage.toLowerCase() === 'messi') {
            const user = msg.pushName;
            quizLeaderboard[user] = (quizLeaderboard[user] || 0) + 1;
            await sock.sendMessage(sender, { text: `🎉 Correct! ${user} gets 1 point!` });
        }
    });
}

startBot();

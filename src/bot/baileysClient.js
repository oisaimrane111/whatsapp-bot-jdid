const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const messageHandler = require('./messageHandler');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // This will display the QR code in your terminal
    });

    sock.ev.on('messages.upsert', async (m) => {
        await messageHandler(sock, m);
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
            console.log('Connection closed, reconnecting...', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp');
        }
    });
}

connectToWhatsApp();

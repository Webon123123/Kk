const fs = require('fs'); const path = require('path'); const process = require('process'); const config = require('../../config');

function formatUptime(seconds) { const pad = (s) => (s < 10 ? '0' : '') + s; const hours = Math.floor(seconds / 3600); const minutes = Math.floor((seconds % 3600) / 60); seconds = Math.floor(seconds % 60); return ${pad(hours)}:${pad(minutes)}:${pad(seconds)}; }

module.exports = { command: 'menu', description: '💫 Muestra todas las funciones disponibles del bot con estilo kawaii.', run: async (sock, message) => { try { const usedMem = process.memoryUsage().heapUsed / 1024 / 1024; const uptime = process.uptime();

const userName = message.pushName || 'Usuario/a';
        const pluginsDir = path.join(__dirname, '..');
        const commandCategories = {};
        const categoryOrder = ['Bot-Info', 'Owner', 'AI', 'Downloader', 'Tools', 'Fun', 'Other'];

        fs.readdirSync(pluginsDir).forEach(category => {
            const categoryDir = path.join(pluginsDir, category);
            if (fs.statSync(categoryDir).isDirectory()) {
                commandCategories[category] = [];
                fs.readdirSync(categoryDir).forEach(file => {
                    if (file.endsWith('.js')) {
                        try {
                            const plugin = require(path.join(categoryDir, file));
                            if (plugin.command && plugin.description) {
                                commandCategories[category].push(plugin);
                            }
                        } catch (err) {
                            console.error(`[❌ Plugin falló]: ${file}`);
                        }
                    }
                });
            }
        });

        let menuText = `🌸 *Hoshinov2* \n`;
        menuText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        menuText += `👤 *Usuario:* ${userName}\n`;
        menuText += `🛡️ *Owner:* ${config.ownerNumber}\n`;
        menuText += `⏳ *Uptime:* ${formatUptime(uptime)}\n`;
        menuText += `💾 *RAM:* ${usedMem.toFixed(2)} MB\n`;
        menuText += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        for (const category of categoryOrder) {
            if (commandCategories[category]?.length > 0) {
                menuText += `🎀 *${category}* 🎀\n`;
                commandCategories[category].forEach(plugin => {
                    menuText += `💠 \`${config.prefix}${plugin.command}\`\n`;
                });
                menuText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            }
        }

        menuText += `\n✨ *Bot:* ${config.botName || 'Hoshino'} ✨`;

        const gifPath = path.join(__dirname, '../../media/menu.gif');
        const chatId = message.key?.remoteJid;

        if (fs.existsSync(gifPath)) {
            await sock.sendMessage(chatId, {
                video: fs.readFileSync(gifPath),
                caption: menuText,
                gifPlayback: true
            }, { quoted: message });
        } else {
            await message.reply(menuText);
        }

    } catch (err) {
        await message.reply(`⚠️ Ocurrió un error mostrando el menú:\n${err.message}`);
    }
}

};

                                

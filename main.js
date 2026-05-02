const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

// 1. Client oluşturma
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

// 2. Komutları Koleksiyona Yükleme
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// cooldown değişkenleri
const cooldowns = new Collection();
const COOLDOWN_SECONDS = 10;

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] ${filePath} dosyasında "data" veya "execute" eksik.`);
        }
    }
}

// 3. Bot Hazır Olduğunda
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Hazır! ${readyClient.user.tag} olarak giriş yapıldı.`);
});


// 4. Etkileşim (Interaction) Yönetimi
client.on(Events.InteractionCreate, async (interaction) => {
    // Sadece Slash komutlarını işle
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Komut bulunamadı: ${interaction.commandName}`);
        return;
    }
    
    try {
        
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorMessage = { content: 'Bu komutu çalıştırırken bir hata oluştu!', flags: MessageFlags.Ephemeral };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// 5. Giriş Yap
client.login(token);
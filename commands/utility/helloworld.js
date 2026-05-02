const { SlashCommandBuilder } = require('discord.js');
const { testRoleId } = require('../../config.json'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('helloworld')
        .setDescription('Hello world mesajı gönderir.'),
    
    async execute(interaction) {
        // Kullanıcının rollerini kontrol et
        // .has() metodu içine verdiğin ID'ye sahip rolün kullanıcıda olup olmadığına bakar
        if (!interaction.member.roles.cache.has(testRoleId)) {
            return await interaction.reply({
                content: "Bu komutu kullanmak için gerekli 'test' rolüne sahip değilsin!",
                ephemeral: true // Mesajı sadece hata alan kullanıcı görür
            });
        }

        // Eğer kullanıcı rol sahibiyse aşağıdaki kısım çalışır
        await interaction.reply(
            `Hello World ${interaction.user.username}.`,
        );
    },
};
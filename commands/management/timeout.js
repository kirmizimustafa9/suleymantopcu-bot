const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
// Config dosyasından timeoutRoleId'yi süslü parantez ile alıyoruz
const { timeoutRoleId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Belirli bir role sahip yetkililerin kullanıcıya zamanaşımı uygulamasını sağlar.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Susturulacak kullanıcı")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("duration")
                .setDescription("Süre (dakika cinsinden)")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Susturma sebebi")
        ),

    async execute(interaction) {
        // 1. Yetki Kontrolü: Kullanıcı config'deki role sahip mi?
        if (!interaction.member.roles.cache.has(timeoutRoleId)) {
            return await interaction.reply({
                content: "Bu komutu kullanmak için gerekli yetkili rolüne sahip değilsin!",
                ephemeral: true,
            });
        }

        const targetUser = interaction.options.getMember("target");
        const duration = interaction.options.getInteger("duration");
        const reason = interaction.options.getString("reason") ?? "Sebep belirtilmedi";

        // 2. Hedef Kullanıcı Kontrolü
        if (!targetUser) {
            return await interaction.reply({ content: "Kullanıcı sunucuda bulunamadı.", ephemeral: true });
        }

        if (!targetUser.moderatable) {
            return await interaction.reply({ 
                content: "Bu kullanıcıya zamanaşımı uygulayamıyorum (Yetkim yetmiyor veya kullanıcı benden üstte).", 
                ephemeral: true 
            });
        }

        try {
            // timeout süresi milisaniye cinsinden hesaplanır (dakika * 60 * 1000)
            await targetUser.timeout(duration * 60 * 1000, reason);

            await interaction.reply({
                content: `${targetUser} kullanıcısına **${duration}** dakika boyunca zamanaşımı uygulandı.\n**Sebep:** ${reason}`
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: "İşlem sırasında bir hata oluştu.", 
                ephemeral: true 
            });
        }
    },
};
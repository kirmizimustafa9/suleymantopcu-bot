const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { banRoleId } = require('../../config.json'); // config.json içinde banRoleId anahtarı olduğunu varsayıyorum

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Belirli bir role sahip yetkililerin kullanıcıyı yasaklamasını sağlar.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Yasaklanacak kullanıcı")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Yasaklanma sebebi"),
        ),

    async execute(interaction) {
        // Rol kontrolü
        if (!interaction.member.roles.cache.has(banRoleId)) {
            return await interaction.reply({
                content: "Bu komutu kullanmak için gerekli yetkili rolüne sahip değilsin!",
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ?? "Sebep belirtilmedi";
        const member = interaction.options.getMember("target");

        // Hiyerarşi ve yetki kontrolü
        if (member && !member.bannable) {
            return await interaction.reply({
                content: "Bu kullanıcıyı yasaklamak için yetkim yetmiyor. (Rolü benden üstte olabilir).",
                ephemeral: true,
            });
        }

        try {
            // Kullanıcıyı yasakla
            await interaction.guild.members.ban(user, { reason: reason });
            
            await interaction.reply({
                content: `${user.tag} başarıyla yasaklandı. \n**Sebep:** ${reason}`,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Kullanıcı yasaklanırken bir hata oluştu.",
                ephemeral: true,
            });
        }
    },
};
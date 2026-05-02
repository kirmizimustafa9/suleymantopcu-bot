const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const { kickRoleId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription(
            "Belirli bir role sahip yetkililerin kullanıcı atmasını sağlar.",
        )
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Atılacak kullanıcı")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("Atılma sebebi"),
        ),

    async execute(interaction) {
        // BURAYI DÜZENLE: 'ROL_ID_BURAYA' kısmına o rolün ID'sini yapıştır

        // Kullanıcının bu role sahip olup olmadığını kontrol et
        if (!interaction.member.roles.cache.has(kickRoleId)) {
            return await interaction.reply({
                content:
                    "Bu komutu kullanmak için gerekli yetkili rolüne sahip değilsin!",
                ephemeral: true, // Bu mesajı sadece komutu kullanan görür
            });
        }

        const user = interaction.options.getUser("target");
        const reason =
            interaction.options.getString("reason") ?? "Sebep belirtilmedi";

        await interaction.reply(`${user} başarıyla atıldı. Sebep: ${reason}`);

        // Gerçekten atmak için:
        await interaction.guild.members.kick(user);
    },
};

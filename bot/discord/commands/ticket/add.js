const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addticketuser')
        .setDescription('Add a user to a ticket channel.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add to the ticket')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.channel.name.includes('-ticket')) {
            return interaction.reply({
                content: 'You can only use this command in a ticket channel.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({
                content: 'Enter a valid user ID.',
                ephemeral: true
            });
        }

        try {
            await interaction.channel.permissionOverwrites.edit(user.id, {
                [PermissionFlagsBits.ViewChannel]: true,
                [PermissionFlagsBits.SendMessages]: true,
                [PermissionFlagsBits.ReadMessageHistory]: true,
            });

            const embed = new EmbedBuilder()
                .setColor('GREEN')
                .setTitle('User Added to Ticket')
                .setDescription(`Successfully added **${member.user.tag}** to this ticket.`)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error updating channel permissions:', error);
            await interaction.reply({
                content: 'There was an error adding the user to the ticket.',
                ephemeral: true
            });
        }
    },
};

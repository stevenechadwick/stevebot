import 'dotenv/config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { default as snek } from '../commands/snek.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log('Ready');
});

client.commands = new Collection();
client.commands.set(snek.data.name, snek);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: 'There was an error executing this command.',
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);

export default client;

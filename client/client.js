import { Client, Collection, GatewayIntentBits } from 'discord.js';
import config from '../config.json';
import snek from '../commands';

const { token } = config;

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

client.login(token);

export default client;

import { SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import config from './config.json' assert { type: 'json' };
import snek from './commands';

const { token, clientId } = config;

const commands = [snek].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);

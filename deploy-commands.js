import 'dotenv/config';
import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { default as snek } from './commands/snek.js';

const commands = [snek].map((command) => command.data.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);

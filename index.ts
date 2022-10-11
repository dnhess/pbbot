/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  api, params, schedule, data,
} from '@serverless/cloud';
import { REST } from 'discord.js';
import { InteractionType, verifyKeyMiddleware } from 'discord-interactions';
import { Routes } from 'discord-api-types/v9';
import { commands } from './src/commands';
import DiscordInteraction from './src/classes/DiscordInteraction';
import { HttpStatusCode } from './src/enums/HttpStatusCodes';
import { convertCollectiblesResponseToCollectiblesData } from './src/interfaces/ICollectibles';
import { convertGameResponseToGameData } from './src/interfaces/IGame';

const rest = new REST({ version: '9' }).setToken(params.DISCORD_BOT_TOKEN);

// Run this everytime commands are added to register them with Discord
api.get('/set-commands', async (_req, res) => {
  // Return each interaction module's commands
  const discordCommands = [];
  commands.forEach((value) => {
    discordCommands.push(value.command);
  });
  try {
    // If running locally, use applicationGuildId to register commands to a specific guild
    if (params.DISCORD_ENVIRONMENT === 'local') {
      await rest.put(
        Routes.applicationGuildCommands(params.DISCORD_CLIENT_ID, params.GUILD_ID),
        { body: discordCommands },
      );
      return res.status(HttpStatusCode.OK).send('Successfully registered application commands for local develop.');
    }

    await rest.put(Routes.applicationCommands(params.DISCORD_CLIENT_ID), {
      body: discordCommands,
    });
    return res.status(HttpStatusCode.OK).send('Successfully registered application commands for production.');
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Error registering application commands.');
  }
});

// This is the main handler for all interactions
api.post('/discord', api.rawBody, verifyKeyMiddleware(params.DISCORD_PUBLIC_KEY), async (req, res) => {
  const { body } = req;
  const interaction = new DiscordInteraction(body.id, body.type, body.data, body.member);
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { type, data } = interaction;
  const commandName = body.data.name ?? undefined;
  if (!commandName) {
    return res.sendStatus(500);
  }

  switch (type) {
    case InteractionType.APPLICATION_COMMAND: {
      const { name } = data;
      console.log(`Received interaction: ${name}`);
      // If the command doesn't exist, return an error
      if (!commands.has(name)) {
        return res.status(HttpStatusCode.NOT_FOUND).send({
          code: HttpStatusCode.NOT_FOUND,
          message: `Command "${name}" not found.`,
          timestamp: Date.now(),
        });
      }
      // Get the command module
      const command = commands.get(name);
      // Run the command
      const interactionResponse = await command.interact(interaction);
      return res.send(interactionResponse);
    }
    case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE: {
      const { name } = data;
      if (!commands.has(name)) {
        return res.status(HttpStatusCode.NOT_FOUND).send({
          code: HttpStatusCode.NOT_FOUND,
          message: `Command "${name}" not found.`,
          timestamp: Date.now(),
        });
      }
      const { autocomplete } = commands.get(name);
      const interactionResponse = await autocomplete(interaction);
      return res.send(interactionResponse);
    }
    default: {
      console.error(`Interaction type ${type} not supported.`);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: 'Unhandled Discord interaction',
        timestamp: Date.now(),
      });
    }
  }
});

// Cron job to fetch collectibles from the API and update the database
schedule.every('12 hours', async () => {
  console.log('Updating collectibles...');
  const collectibles = await fetch(`${params.BASE_API_URL}/prizes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const collectiblesJson = await collectibles.json();

  const collectiblesData = convertCollectiblesResponseToCollectiblesData(collectiblesJson);

  // Set the collectibles in the database
  console.log('setting collectibles in database...');

  const perChunk = 25; // items per chunk

  const result = collectiblesData.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push({ key: `collectibles:${item.name}`, value: item });

    return resultArray;
  }, []);

  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of result) {
    // eslint-disable-next-line no-await-in-loop
    await data.set(chunk, { overwrite: true });
  }

  console.log('Collectibles updated!');
});

// Cron job to fetch all games from the API and update the database
// The URL is https://playbiteapi.azurewebsites.net/api/feed?plat=web
// we are looking for the object with a title of "All"
schedule.every('12 hours', async () => {
  console.log('Updating games...');
  const games = await fetch(`${params.BASE_API_URL}/feed?plat=web`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const gamesJson = await games.json();

  const gamesData = convertGameResponseToGameData(gamesJson.filter((game) => game.title === 'All')[0]);

  // Set the games in the database
  console.log('setting games in database...');

  const perChunk = 25; // items per chunk

  const result = gamesData.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push({ key: `games:${item.name}`, value: item });

    return resultArray;
  }, []);

  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of result) {
    // eslint-disable-next-line no-await-in-loop
    await data.set(chunk, { overwrite: true });
  }

  console.log('Games updated!');
});

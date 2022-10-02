/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InteractionResponseType } from 'discord-interactions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { data, params } from '@serverless/cloud';
import DiscordInteraction from '../classes/DiscordInteraction';
import { ICommand } from '../interfaces/ICommand';
import CommandOptionType from '../enums/ICommandOptionType';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import { IGameData } from '../interfaces/IGame';

export const command: ICommand = {
  name: 'game',
  description: 'Get information about a game',
  type: CommandOptionType.SUB_COMMAND,
  options: [
    {
      name: 'game',
      description: 'The game to get information about',
      type: CommandOptionType.STRING,
      required: true,
      autocomplete: true,
    },
  ],
};

export const autocomplete = async (interaction: DiscordInteraction): Promise<any> => {
  const focused = interaction.getFocusedOption();
  const choices = [];
  if (focused) {
    const { value } = focused;
    const results = await data.get(`games:${capitalizeFirstLetter(value)}*`, { limit: 20 });
    if ('items' in results) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of results.items) {
        const game = item.value as IGameData;
        choices.push({
          name: game.name,
          value: game.id,
        });
      }
    }
  }

  return {
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
      choices,
    },
  };
};

// Interaction
// Get the gam

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
  // Get the game name from the interaction
  const gameId = interaction.getOptionValue('game') as string;
  // Get the game from the database
  const game = await data.get(`games:${gameId}`) as IGameData;

  // Make an api call to three different endpoints to get the game rankings
  // Rankings are for all, day, week
  // URL is ${params.BASE_API_URL}/games/{id}6/rankings?type={type}
  // Type is all, day, week
  const rankings = await Promise.all([
    fetch(`${params.BASE_API_URL}/games/${gameId}/rankings?type=all`),
    fetch(`${params.BASE_API_URL}/games/${gameId}/rankings?type=day`),
    fetch(`${params.BASE_API_URL}/games/${gameId}/rankings?type=week`),
  ]);

  // Get the json from the rankings
  const rankingsJson = await Promise.all(rankings.map((r) => r.json()));

  // Get all, day, week rankings as index 0, 1, 2
  const allRankings = rankingsJson[0];
  const dayRankings = rankingsJson[1];
  const weekRankings = rankingsJson[2];

  // Get the top 10 rankings for each
  const top10All = allRankings.slice(0, 10);
  const top10Day = dayRankings.slice(0, 10);
  const top10Week = weekRankings.slice(0, 10);

  // Map the rankings to a string
  const top10AllString = top10All.map((r, i) => `${r.position}. ${r.name} - ${r.points} \n`);
  const top10DayString = top10Day.map((r, i) => `${r.position}. ${r.name} - ${r.points} \n`);
  const top10WeekString = top10Week.map((r, i) => `${r.position}. ${r.name} - ${r.points} \n`);

  // Return the game with the title, descirpiton, image, and rankings
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          title: game.name,
          description: game.description,
          thumbnail: {
            url: game.promoImageUrl,
          },
          fields: [
            {
              name: 'All Time Rankings',
              value: top10AllString.join(''),
            },
            {
              name: 'Day Rankings',
              value: top10DayString.join(''),
            },
            {
              name: 'Week Rankings',
              value: top10WeekString.join(''),
            },
          ],
        },
      ],
    },
  };
};

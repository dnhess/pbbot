import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { params } from '@serverless/cloud';
import DiscordInteraction from '../classes/DiscordInteraction';
import CommandOptionType from '../enums/ICommandOptionType';
import { ICommand } from '../interfaces/ICommand';

export const command: ICommand = {
  name: 'userlookup',
  description: 'Get info and stats for any Playbite user!',
  options: [
    {
      name: 'username',
      description: 'The username to look up',
      type: CommandOptionType.STRING,
      required: true
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (interaction: DiscordInteraction, _interactionActionOverwrite?: any): Promise<any> => {
  const username = interaction.getOptionValue('username') as string;

  // Get leaderboard from API
  const userStats = await fetch(`${params.BASE_API_URL}/users/${username}/stats`);
  const userJson = await userStats.json();
  // If leaderboard is empty, return error
  if (!userJson) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'User not found.',
      },
    };
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          title: userJson["displayName"],
          description: userJson["bio"],
          fields: userJson["stats"].map((statItem) => ({
            name: `${statItem["icon"]} ${statItem["description"]}`,
            value: statItem["value"],
            inline: true,
          })),
        },
      ],
    },
  };
};

import { InteractionResponseType } from 'discord-interactions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { params } from '@serverless/cloud';
import type DiscordInteraction from '../classes/DiscordInteraction';
import CommandOptionType from '../enums/ICommandOptionType';
import type { ICommand } from '../interfaces/ICommand';

export const command: ICommand = {
  name: 'user',
  description:
    'Get info and stats for a Playbite user. Contributed by TotallyNotSeth',
  options: [
    {
      name: 'username',
      description: 'The username to look up',
      type: CommandOptionType.STRING,
      required: true,
    },
  ],
};

interface IUserStatsResponse {
  displayName: string;
  bio: string;
  icon: string;
  description: string;
  value: string;
  stats: any;
  imageUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (
  interaction: DiscordInteraction,
  _interactionActionOverwrite?: any
  ): Promise<any> => {
  const username = interaction.getOptionValue('username') as string;

  // Get leaderboard from API
  const userStats = await fetch(
    `${params.BASE_API_URL}/users/${username}/stats`
  );
  try {
    const userJson: IUserStatsResponse = await userStats.json();
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [
          {
            title: userJson?.displayName,
            description: userJson?.bio,
            fields: userJson?.stats.map((statItem: any) => ({
              name: `${statItem.icon} ${statItem.description}`.replace(
                'undefined ',
                ''
                ),
              value: statItem.value.toLocaleString(),
              inline: true,
            })),
            thumbnail: {
              url: userJson?.imageUrl,
            },
          },
        ],
      },
    };
  } catch(SyntaxError) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `User "${username}" not found.`,
      },
    };
  }
};

// eslint-disable-next-line import/no-extraneous-dependencies
import { params } from '@serverless/cloud';
import {
  InteractionResponseFlags,
  InteractionResponseType,
} from 'discord-interactions';

import type DiscordInteraction from '../classes/DiscordInteraction';
import CommandOptionType from '../enums/ICommandOptionType';
import type { ICommand } from '../interfaces/ICommand';

enum LeaderboardType {
  LAST_24_HOURS = 'day',
  LAST_7_DAYS = 'week',
  ALL_TIME = 'all',
}

enum LeaderboardTypeToFriendlyName {
  day = 'Last 24 Hours',
  week = 'Last 7 Days',
  all = 'All Time',
}

interface ILeaderboardResponse {
  position: number;
  name: string;
  points: number;
  imageUrl: string;
}

export const command: ICommand = {
  name: 'leaderboard',
  description: 'Get the leaderboard',
  options: [
    {
      name: 'type',
      description: 'The type of leaderboard',
      type: CommandOptionType.STRING,
      required: true,
      choices: [
        {
          name: 'Last 24 Hours',
          value: LeaderboardType.LAST_24_HOURS,
        },
        {
          name: 'Last 7 Days',
          value: LeaderboardType.LAST_7_DAYS,
        },
        {
          name: 'All Time',
          value: LeaderboardType.ALL_TIME,
        },
      ],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (
  interaction: DiscordInteraction,
  _interactionActionOverwrite?: any
): Promise<any> => {
  // Get choice
  const choice = interaction?.data?.options?.[0]?.value as LeaderboardType;
  // If choice isn't a valid leaderboard type, return error
  if (!Object.values(LeaderboardType).includes(choice)) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      flags: InteractionResponseFlags.EPHEMERAL,
      data: {
        content: 'Invalid leaderboard type',
      },
    };
  }

  // Get leaderboard from API
  const leaderboard = await fetch(
    `${params.BASE_API_URL}/rankings?type=${choice}`
  );
  const leaderboardJson: ILeaderboardResponse[] = await leaderboard.json();
  // If leaderboard is empty, return error
  if (!leaderboard) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'No leaderboard found',
      },
    };
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          title: `Leaderboard - ${LeaderboardTypeToFriendlyName[choice]}`,
          description: `The top players on the ${LeaderboardTypeToFriendlyName[choice]} leaderboard`,
          fields: leaderboardJson.map((leaderboardItem) => ({
            // image: leaderboardItem.imageUrl,
            name: `${leaderboardItem.position}. ${leaderboardItem.name}`,
            value: `${new Intl.NumberFormat().format(
              leaderboardItem.points
            )} points`,
            inline: true,
          })),
        },
      ],
    },
  };
};

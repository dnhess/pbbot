// eslint-disable-next-line import/no-extraneous-dependencies
import { params } from '@serverless/cloud';
import { InteractionResponseType } from 'discord-interactions';
import { DateTime } from 'luxon';

import type DiscordInteraction from '../classes/DiscordInteraction';
import CommandOptionType from '../enums/ICommandOptionType';
import { convertAuctionsResponseToAuctionData } from '../interfaces/IAuctions';
import type { ICommand } from '../interfaces/ICommand';

export const command: ICommand = {
  name: 'auction',
  description: 'All current auctions',
  type: CommandOptionType.SUB_COMMAND,
  options: [
    {
      name: 'name',
      description: 'The name of the auction',
      type: CommandOptionType.STRING,
      required: true,
      autocomplete: true,
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const autocomplete = async (
  interaction: DiscordInteraction
): Promise<any> => {
  const focused = interaction.getFocusedOption();
  const choices = [];
  if (focused) {
    const auctions = await fetch(
      `${params.BASE_API_URL}/auctions?plat=web-android`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const auctionsJson = await auctions.json();
    const auctionsData = convertAuctionsResponseToAuctionData(auctionsJson);

    // Filter autocomplete where status is not 2
    const filteredAuctions = auctionsData.filter(
      (auction) => auction.status === 0
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const auction of filteredAuctions) {
      choices.push({
        name: auction.prizeName,
        value: auction.auctionId,
      });
    }
  }

  return {
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: {
      choices,
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (
  interaction: DiscordInteraction,
  _interactionActionOverwrite?: any
): Promise<any> => {
  // Get the auction name from the interaction
  const auctionId = interaction.getOptionValue('name') as string;

  // Get the auction from the database
  const auctions = await fetch(
    `${params.BASE_API_URL}/auctions?plat=web-android`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const auctionsJson = await auctions.json();

  const auctionsData = convertAuctionsResponseToAuctionData(auctionsJson);

  const auction = auctionsData.find(
    (auctionItem) => auctionItem.auctionId === auctionId
  );

  if (!auction) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Auction not found.`,
      },
    };
  }

  const startDate = DateTime.local();
  const endDate = DateTime.fromISO(auction.endDate);

  // Calcuate how long until the auction ends
  const timeUntilEnd = endDate.diff(startDate, [
    'days',
    'hours',
    'minutes',
    'seconds',
  ]);

  // Return the auctions as a list that only the user can see
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          title: auction.prizeName,
          description: auction.prizeDescription,
          thumbnail: {
            url: auction.prizeImageUrl,
          },
          fields: [
            {
              name: 'Current Bid',
              value: auction.currentBidAmount,
              inline: true,
            },
            {
              name: 'Current Bidder',
              value: auction.currentBidder,
              inline: true,
            },
            {
              name: 'Number of Bids',
              value: auction.bidderCount,
              inline: true,
            },
          ],
          footer: {
            text: `Auction ends in ${timeUntilEnd.days} days, ${timeUntilEnd.hours} hours, ${timeUntilEnd.minutes} minutes, and ${timeUntilEnd.seconds} seconds`,
          },
        },
      ],
    },
  };
};

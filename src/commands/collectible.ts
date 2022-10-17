/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { data } from '@serverless/cloud';
import { InteractionResponseType } from 'discord-interactions';

import type DiscordInteraction from '../classes/DiscordInteraction';
import CommandOptionType from '../enums/ICommandOptionType';
import type { ICollectiableResponse } from '../interfaces/ICollectibles';
import type { ICommand } from '../interfaces/ICommand';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';

export const command: ICommand = {
  name: 'collectible',
  description: 'A list of Playbite collectibles. Go ahead, find your favorite!',
  type: CommandOptionType.SUB_COMMAND,
  options: [
    {
      name: 'name',
      description: 'The name of the collectible',
      type: CommandOptionType.STRING,
      required: true,
      autocomplete: true,
    },
  ],
};

export const autocomplete = async (
  interaction: DiscordInteraction
): Promise<any> => {
  const focused = interaction.getFocusedOption();
  const choices = [];
  if (focused) {
    const { value } = focused;
    const results = await data.get(
      `collectibles:${capitalizeFirstLetter(value)}*`,
      { limit: 20 }
    );
    if ('items' in results) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of results.items) {
        const collectible = item.value as ICollectiableResponse;
        choices.push({
          name: collectible.name,
          value: collectible.name,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const interact = async (
  interaction: DiscordInteraction,
  _interactionActionOverwrite?: any
): Promise<any> => {
  // Get the collectible name from the interaction
  const collectibleName = interaction.getOptionValue('name') as string;

  // Get the collectible from the database
  const collectible = (await data.get(
    `collectibles:${collectibleName}`
  )) as ICollectiableResponse;

  // Return the collectibeles as a list that only the user can see
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          title: collectible.name,
          description: collectible.description,
          thumbnail: {
            url: encodeURI(collectible.promoImageUrl),
          },
          fields: [
            {
              name: 'Cost',
              value: collectible.cost,
              inline: true,
            },
            {
              name: 'Available',
              value: collectible.available,
              inline: true,
            },
            {
              name: 'Redeems',
              value: collectible.redeems,
              inline: true,
            },
          ],
        },
      ],
    },
  };
};

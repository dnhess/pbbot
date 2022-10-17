/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InteractionResponseFlags,
  InteractionResponseType,
} from 'discord-interactions';

import type DiscordInteraction from '../classes/DiscordInteraction';
import type { ICommand } from '../interfaces/ICommand';
// eslint-disable-next-line import/no-cycle
import { commands } from './index';

export const command: ICommand = {
  name: 'help',
  description: 'Get help with Playbite commands!',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const interact = async (
  _interaction: DiscordInteraction,
  _interactionActionOverwrite?: any
): Promise<any> => {
  // Loop through and return all the command names and descriptions
  const commandsArray = [];
  commands.forEach((parentCommand) => {
    commandsArray.push({
      name: parentCommand.command.name,
      value: parentCommand.command.description,
    });
  });

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          title: 'Playbite - Help',
          description: 'Here is a list of all available commands!',
          fields: commandsArray,
        },
      ],
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
};

import { InteractionResponseType } from 'discord-interactions';
import DiscordInteraction from '../classes/DiscordInteraction';
import { ICommand } from '../interfaces/ICommand';

export const command: ICommand = {
  name: 'createcollectible',
  description: 'Learn how to create your very own collectible on Playbite!',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (_interaction: DiscordInteraction, _interactionActionOverwrite?: any): Promise<any> => ({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    embeds: [
      {
        title: 'Creating your own collectible on Playbite',
        description: 'Learn how to create your very own collectible on Playbite!',
        url: 'https://www.playbite.com/creating-your-own-collectible-on-playbite/',
      },
    ],
  },
});

import { InteractionResponseType } from 'discord-interactions';
import DiscordInteraction from '../classes/DiscordInteraction';
import { ICommand } from '../interfaces/ICommand';

export const command: ICommand = {
  name: 'play',
  description: 'Play now in your browser!',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (_interaction: DiscordInteraction, _interactionActionOverwrite?: any): Promise<any> => ({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    embeds: [
      {
        title: 'Play now in your browser!',
        description: 'Earn awesome rewards by playing games!',
        url: 'https://www.app.playbite.com/',
        thumbnail: { // Probably need to update this url
          url: 'https://uploads-ssl.webflow.com/5edd8e1d77a7c53d4e3a6a46/5eddc5d1aa51752e01883ba1_P%20Logo%403x.png',
        },
      },
    ],
  },
});

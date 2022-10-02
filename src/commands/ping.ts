import { InteractionResponseType } from 'discord-interactions';
import DiscordInteraction from '../classes/DiscordInteraction';
import { ICommand } from '../interfaces/ICommand';

export const command: ICommand = {
  name: 'ping',
  description: 'Pong!',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (_interaction: DiscordInteraction, _interactionActionOverwrite?: any): Promise<any> => ({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: 'Pong!',
  },
});

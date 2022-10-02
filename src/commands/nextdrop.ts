/* eslint-disable @typescript-eslint/no-explicit-any */
import { InteractionResponseType } from 'discord-interactions';
import { DateTime } from 'luxon';
import DiscordInteraction from '../classes/DiscordInteraction';
import { ICommand } from '../interfaces/ICommand';

export const command: ICommand = {
  name: 'nextdrop',
  description: 'Time until next drop!',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const interact = async (_interaction: DiscordInteraction, _interactionActionOverwrite?: any): Promise<any> => {
  // Returns time until the drop at 7pm CST using luxon
  const now = DateTime.local().setZone('America/Chicago');
  const nextDrop = now.set({
    hour: 19, minute: 0, second: 0, millisecond: 0,
  });
  let timeUntilDrop = nextDrop.diff(now, ['hours', 'minutes', 'seconds']);

  // If time drop is in the past, recreate the drop time for tomorrow
  if (timeUntilDrop.minutes < 0 || timeUntilDrop.hours < 0 || timeUntilDrop.seconds < 0) {
    // Create a new drop time for tomorrow at 7pm CST
    const tomorrow = DateTime.local().setZone('America/Chicago').plus({ days: 1 });
    const tomrrowNextDrop = tomorrow.set({
      hour: 19, minute: 0, second: 0, millisecond: 0,
    });
    timeUntilDrop = tomrrowNextDrop.diff(now, ['hours', 'minutes', 'seconds']);
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          title: `The next drop is in ${timeUntilDrop.hours} hours, ${timeUntilDrop.minutes} minutes, and ${Math.trunc(timeUntilDrop.seconds)} seconds!`,
        },
      ],
    },
  };
};

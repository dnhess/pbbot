import { InteractionResponseType } from "discord-interactions";

import type DiscordInteraction from "../classes/DiscordInteraction";
import type { ICommand } from "../interfaces/ICommand";

export const command: ICommand = {
  name: "drops",
  description: "Times for all drops!",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (
  _interaction: DiscordInteraction,
  _interactionActionOverwrite?: any
): Promise<any> => ({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    embeds: [
      {
        title: "Playbite Drops",
        image: {
          url: "https://media.discordapp.net/attachments/876983102830968874/1022663018779263067/unknown.png?width=319&height=904",
        },
      },
    ],
  },
});

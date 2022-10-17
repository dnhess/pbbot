import { InteractionResponseType } from "discord-interactions";

import type DiscordInteraction from "../classes/DiscordInteraction";
import type { ICommand } from "../interfaces/ICommand";

export const command: ICommand = {
  name: "whoami",
  description: "Get your user name",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interact = async (
  interaction: DiscordInteraction,
  _interactionActionOverwrite?: any
): Promise<any> => ({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: `Your username is ${interaction.member.user.username}`,
  },
});

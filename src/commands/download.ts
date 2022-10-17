import { InteractionResponseType } from "discord-interactions";

import type DiscordInteraction from "../classes/DiscordInteraction";
import type { ICommand } from "../interfaces/ICommand";

export const command: ICommand = {
  name: "download",
  description: "Download now to start playing!",
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
        title: "Playbite - App Store",
        description: "Download now for iOS!",
        url: "https://apps.apple.com/us/app/playbite/id1522413113?ct=discord",
      },
      {
        title: "Playbite - Google Play",
        description: "Download now for Android!",
        url: "https://play.google.com/store/apps/details?id=com.playbite.app&utm_source=playbite&utm_medium=discord",
      },
    ],
  },
});

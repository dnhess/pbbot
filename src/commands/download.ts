import { InteractionResponseType } from "discord-interactions";
import DiscordInteraction from "../classes/DiscordInteraction";
import { ICommand } from "../interfaces/ICommand";


export const command: ICommand = {
    name: 'download',
    description: 'Download now to start playing!',
};

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
    return {
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
                }
            ]
        }
    }
}
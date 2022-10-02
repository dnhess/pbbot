import { InteractionResponseType } from "discord-interactions";
import DiscordInteraction from "../classes/DiscordInteraction";
import { ICommand } from "../interfaces/ICommand";

export const command: ICommand = {
    name: "drops",
    description: "Times for all drops!",
};

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
    // Returns an image with the drop image
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: "Playbite Drops",
                    image: {
                        url: "https://media.discordapp.net/attachments/876983102830968874/1022663018779263067/unknown.png?width=319&height=904"
                    }
                }
            ]
        },
    }
}
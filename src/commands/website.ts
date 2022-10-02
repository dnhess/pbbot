import { InteractionResponseType } from "discord-interactions";
import DiscordInteraction from "../classes/DiscordInteraction";
import { ICommand } from "../interfaces/ICommand";

export const command: ICommand = {
    name: "website",
    description: "The website for playbite!",
};

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: "Playbite",
                    description: "Earn awesome rewards by playing games!",
                    url: "https://www.playbite.com/",
                    thumbnail: { // Probably need to update this url
                        url: "https://uploads-ssl.webflow.com/5edd8e1d77a7c53d4e3a6a46/5eddc5d1aa51752e01883ba1_P%20Logo%403x.png"
                    }
                }
            ]
        },
    }
}
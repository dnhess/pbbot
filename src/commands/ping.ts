import { InteractionResponseType } from "discord-interactions";
import DiscordInteraction from "../classes/DiscordInteraction";
import { ICommand } from "../interfaces/ICommand";

export const command: ICommand = {
    name: "ping",
    description: "Pong!",
};

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: "Pong!",
        },
    }
}
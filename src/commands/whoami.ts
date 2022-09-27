import { InteractionResponseType } from "discord-interactions";
import DiscordInteraction from "../classes/DiscordInteraction";
import { ICommand } from "../interfaces/ICommand";

export const command: ICommand =     {
    name: 'whoami',
    description: 'Get your user name'
  }

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
    console.log(interaction)
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Your username is ${interaction.member.user.username}`,
        },
    }
}
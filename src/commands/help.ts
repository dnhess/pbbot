import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";
import DiscordInteraction from "../classes/DiscordInteraction";
import { ICommand } from "../interfaces/ICommand";
import { commands } from "./index";

export const command: ICommand = {
    name: 'help',
    description: 'Get help with Playbite commands!',
};

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
    // Loop through and return all the command names and descriptions
    const commandsArray = [];
    commands.forEach((command) => {
        commandsArray.push({
            name: command.command.name,
            value: command.command.description
        })
    })

    console.log(commandsArray)

    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: "Playbite - Help",
                    description: "Here is a list of all available commands!",
                    fields: commandsArray
                }
            ],
            flags: InteractionResponseFlags.EPHEMERAL
        }
    }
}
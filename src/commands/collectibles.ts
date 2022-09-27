import { InteractionResponseType, InteractionResponseFlags } from "discord-interactions";
import DiscordInteraction from "../classes/DiscordInteraction";
import { ICommand } from "../interfaces/ICommand";
import { CommandOptionType } from "../enums/ICommandOptionType";
import { params } from "@serverless/cloud";
import { convertCollectiblesResponseToCollectiblesData, ICollectiableResponse, ICollectibleData } from "../interfaces/ICollectibles";

export const command: ICommand = {
    name: "collectibles",
    description: "A list of Playbite collectibles. Go ahead, find your favorite!"
}

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
    // Make an api call to get the collectibles
    const collectibles = await fetch(`${params.BASE_API_URL}/prizes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const collectiblesJson= await collectibles.json();

    const collectiblesData = convertCollectiblesResponseToCollectiblesData(collectiblesJson);
    const collectibleFields = collectiblesData.map(collectible => {
        return {
            name: collectible.name,
            value: collectible.description
        }
    })

    // Return the collectibeles as a list that only the user can see
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: "Here are the collectibles!",
            embeds: [
                {
                    title: "Collectibles",
                    fields: collectibleFields
                }
            ],
            flags: InteractionResponseFlags.EPHEMERAL
        }
    }

}
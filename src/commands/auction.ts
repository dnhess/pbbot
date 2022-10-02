import { InteractionResponseType } from "discord-interactions";
import DiscordInteraction from "../classes/DiscordInteraction";
import { ICommand } from "../interfaces/ICommand";
import { CommandOptionType } from "../enums/ICommandOptionType";
import { params } from "@serverless/cloud";
import { convertAuctionsResponseToAuctionData } from "../interfaces/IAuctions";
import { DateTime } from "luxon";

export const command: ICommand = {
    name: "auction",
    description: "All current auctions",
    type: CommandOptionType.SUB_COMMAND,
    options: [
        {
            name: "name",
            description: "The name of the auction",
            type: CommandOptionType.STRING,
            required: true,
            autocomplete: true
        }
    ]
}

export const autocomplete = async (interaction: DiscordInteraction): Promise<any> => {
    const focused = interaction.getFocusedOption()
    const choices = [];
    if (focused) {
        const { value } = focused;
        const auctions = await fetch(`${params.BASE_API_URL}/auctions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const auctionsJson= await auctions.json();
        const auctionsData = convertAuctionsResponseToAuctionData(auctionsJson);

        for (const auction of auctionsData) {
            choices.push({
                name: auction.prizeName,
                value: auction.prizeName
            })
        }
    }

    return {
        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
        data: {
            choices
        }
    }
}

export const interact = async (interaction: DiscordInteraction, interactionActionOverwrite?: any): Promise<any> => {
    // Get the auction name from the interaction
    const auctionName = interaction.getOptionValue('name') as string

    // Get the auction from the database
    const auctions = await fetch(`${params.BASE_API_URL}/auctions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const auctionsJson= await auctions.json();
    const auctionsData = convertAuctionsResponseToAuctionData(auctionsJson);

    const auction = auctionsData.find(auction => auction.prizeName === auctionName);

    // Convert start and end date ISO string to luxon DateTime
    const startDate = DateTime.fromISO(auction.startDate);
    const endDate = DateTime.fromISO(auction.endDate);

    // Calcuate how long until the auction ends
    const timeUntilEnd = endDate.diff(startDate, ['days', 'hours', 'minutes', 'seconds']);

    // Return the auctions as a list that only the user can see
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: auction.prizeName,
                    description: auction.prizeDescription,
                    thumbnail: {
                        url: auction.prizeImageUrl
                    },
                    fields: [
                        {
                            name: 'Current Bid',
                            value: auction.currentBidAmount,
                            inline: true
                        },
                        {
                            name: 'Current Bidder',
                            value: auction.currentBidder,
                            inline: true
                        },
                        {
                            name: 'Number of Bids',
                            value: auction.bidderCount,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `Auction ends in ${timeUntilEnd.days} days, ${timeUntilEnd.hours} hours, ${timeUntilEnd.minutes} minutes, and ${timeUntilEnd.seconds} seconds`
                    }
                }
            ]
        },
    }
}
import { api, params } from '@serverless/cloud'
import { InteractionType, verifyKeyMiddleware } from 'discord-interactions'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { commands } from './src/commands'
import DiscordInteraction from './src/classes/DiscordInteraction'
import { HttpStatusCode } from './src/enums/HttpStatusCodes'

const rest = new REST({ version: '9' }).setToken(params.DISCORD_BOT_TOKEN)

// Run this everytime commands are added to register them with Discord
api.get('/set-commands', async (req, res) => {
    // Return each interaction module's commands
    const discordCommands = []
    commands.forEach((value, key) => {
        discordCommands.push(value.command)
    })
  try {
    await rest.put(Routes.applicationGuildCommands(params.DISCORD_CLIENT_ID, params.GUILD_ID), {
      body: discordCommands
    })
    return res.sendStatus(200)
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
})

// This is the main handler for all interactions
api.post('/discord', api.rawBody, verifyKeyMiddleware(params.DISCORD_PUBLIC_KEY), async (req, res) => {
  const body = req.body
  const interaction = new DiscordInteraction(body.id, body.type, body.data, body.member)
  const { type, data } = interaction
  const commandName = body.data.name ?? undefined
  if (!commandName) {
    return res.sendStatus(500)
  }

  switch(type) {
    case InteractionType.APPLICATION_COMMAND: {
        const { name } = data
        console.log(`Received interaction: ${name}`)
        // If the command doesn't exist, return an error
        if (!commands.has(name)) {
            return res.status(HttpStatusCode.NOT_FOUND).send({
                code: HttpStatusCode.NOT_FOUND,
                message: `Command "${name}" not found.`,
                timestamp: Date.now(),
              });
        }
        // Get the command module
        const command = commands.get(name)
        // Run the command
        const interactionResponse = await command.interact(interaction)
        return res.send(interactionResponse)
    }
    default: {
        console.error(`Interaction type ${type} not supported.`)
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
            code: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Unhandled Discord interaction',
            timestamp: Date.now(),
        });
    }
}
})
import { ICommand } from './ICommand';
import { IDiscordInteraction } from './IDiscordInteraction';

export interface ICommandModule {
    command: ICommand;
    interact: (interaction: IDiscordInteraction, interactionActionOverwrite?: any) => Promise<void>;
}

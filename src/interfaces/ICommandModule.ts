import { ICommand } from './ICommand';
import { IDiscordInteraction } from './IDiscordInteraction';

export interface ICommandModule {
    command: ICommand;
    autocomplete?: (interaction: IDiscordInteraction) => Promise<any>;
    interact: (interaction: IDiscordInteraction, interactionActionOverwrite?: any) => Promise<void>;
}

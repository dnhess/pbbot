/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICommand } from "./ICommand";
import type { IDiscordInteraction } from "./IDiscordInteraction";

export interface ICommandModule {
  command: ICommand;
  autocomplete?: (interaction: IDiscordInteraction) => Promise<any>;
  interact: (
    interaction: IDiscordInteraction,
    interactionActionOverwrite?: any
  ) => Promise<void>;
}

import type CommandOptionType from "../enums/ICommandOptionType";
import type { ICommandChoice } from "./ICommandChoice";

export interface ICommand {
  name: string;
  description?: string;
  required?: boolean;
  autocomplete?: boolean;
  focused?: boolean;
  value?: string;
  options?: ICommand[];
  type?: CommandOptionType;
  choices?: ICommandChoice[];
  option?: ICommand[];
}

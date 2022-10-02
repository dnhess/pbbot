import Command from '../enums/Command';
import { ICommand } from './ICommand';
import { IDiscordMemberData } from './IDiscordMemberData';

export interface IDiscordInteractionData {
  id: string;
  name: Command;
  options?: ICommand[];
  guild_id?: string;
  member: IDiscordMemberData
}

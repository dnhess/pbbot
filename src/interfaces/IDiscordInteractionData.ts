import { Command } from '../enums';
import { ICommand } from './ICommand';
import { IDiscordMemberData } from './IDiscordMemberData';

export interface IDiscordInteractionData {
  id: string;
  name: Command;
  options?: ICommand[];
  guild_id?: string;
  member: IDiscordMemberData
}
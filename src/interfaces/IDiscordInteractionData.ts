import type Command from '../enums/Command';
import type { ICommand } from './ICommand';
import type { IDiscordMemberData } from './IDiscordMemberData';

export interface IDiscordInteractionData {
  id: string;
  name: Command;
  options?: ICommand[];
  guild_id?: string;
  member: IDiscordMemberData;
}

import { ICommandModule } from '../interfaces/ICommandModule';
import { Command } from '../enums/Command';
import * as ping from './ping';
import * as whoami from './whoami';
import * as leaderboard from './leaderboard';
import * as website from './website';
import * as collectible from './collectible';
export const commands: Map<Command, ICommandModule> = new Map([
  [Command.PING, ping],
  [Command.WHOAMI, whoami],
  [Command.LEADERBOARD, leaderboard],
  [Command.WEBSITE, website],
  [Command.COLLECTIBLE, collectible],
]);
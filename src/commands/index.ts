import { ICommandModule } from '../interfaces/ICommandModule';
import Command from '../enums/Command';
import * as ping from './ping';
import * as whoami from './whoami';
import * as leaderboard from './leaderboard';
import * as website from './website';
import * as collectible from './collectible';
import * as download from './download';
import * as drops from './drops';
import * as nextdrop from './nextdrop';
import * as auction from './auction';
// eslint-disable-next-line import/no-cycle
import * as help from './help';
import * as game from './game';

const commands: Map<Command, ICommandModule> = new Map([
  [Command.PING, ping],
  [Command.WHOAMI, whoami],
  [Command.LEADERBOARD, leaderboard],
  [Command.WEBSITE, website],
  [Command.COLLECTIBLE, collectible],
  [Command.DOWNLOAD, download],
  [Command.DROPS, drops],
  [Command.NEXTDROP, nextdrop],
  [Command.AUCTION, auction],
  [Command.HELP, help],
  [Command.GAME, game],
]);
export default commands;

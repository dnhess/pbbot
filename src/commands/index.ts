import Command from "../enums/Command";
import type { ICommandModule } from "../interfaces/ICommandModule";
import * as auction from "./auction";
import * as collectible from "./collectible";
import * as createcollectible from "./createcollectible";
import * as download from "./download";
import * as drops from "./drops";
import * as game from "./game";
// eslint-disable-next-line import/no-cycle
import * as help from "./help";
import * as leaderboard from "./leaderboard";
import * as nextdrop from "./nextdrop";
import * as ping from "./ping";
import * as play from "./play";
import * as website from "./website";
import * as whoami from "./whoami";

// eslint-disable-next-line import/prefer-default-export
export const commands: Map<Command, ICommandModule> = new Map([
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
  [Command.CREATECOLLECTIBLE, createcollectible],
  [Command.PLAY, play],
]);

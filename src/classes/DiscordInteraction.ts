/* eslint-disable no-useless-constructor */
import { IDiscordInteraction } from '../interfaces/IDiscordInteraction';
import { IDiscordInteractionData } from '../interfaces/IDiscordInteractionData';
import { IDiscordMemberData } from '../interfaces/IDiscordMemberData';

export default class DiscordInteraction implements IDiscordInteraction {
  constructor(
    public id: string,
    public type: number,
    public data: IDiscordInteractionData,
    public member: IDiscordMemberData,
  ) {}

  getOptionValue<T = string>(name: string): T | undefined {
    if (!this.data.options) return;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const option = this.data.options.find((option) => option.name === name)
      ?.value as unknown;
    // eslint-disable-next-line consistent-return
    return option ? (option as T) : undefined;
  }

  getFocusedOption() {
    if (!this.data.options) return;
    // eslint-disable-next-line consistent-return
    return this.data.options.find((option) => option.focused);
  }
}

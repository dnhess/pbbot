export interface IDiscordMemberData {
    joined_at: string;
    roles: string[];
    deaf: boolean;
    premium_since: string;
    user: {
        avatar?: string;
        avatar_decoration?: string;
        discriminator: string;
        id: string;
        public_flags: number;
        username: string;
    }
}
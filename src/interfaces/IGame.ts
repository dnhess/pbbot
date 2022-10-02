interface IGameResponse {
    title: string;
    type: string;
    payload: {
        games: IGameData[];
    }
}

export interface IGameData {
    id: string;
    name: string;
    description: string;
    promoImageUrl?: string;
    posterImageUrl?: string;
    pointMultiplier?: number;
}

export const convertGameResponseToGameData = (game: IGameResponse): IGameData[] => {
    console.log(game);
    return game.payload.games.map(game => {
        return {
            id: game.id,
            name: game.name,
            description: game.description,
            promoImageUrl: game.promoImageUrl || game.posterImageUrl
        }
    })
}
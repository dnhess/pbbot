import { eCollectibleCategories } from "../enums/eCollectibleCategories";

export interface ICollectibleCategoryData {
    id: string;
    name: eCollectibleCategories;
    subtitle: string;
    priority: number;
}

export interface ICollectiableResponse {
    "id": string;
    "name": string,
    "description": string,
    "cost": number,
    "promoImageUrl": string,
    "prizeType": string,
    "purchaseUrl"?: string,
    "categories"?: eCollectibleCategories[]
    "categoryData": ICollectibleCategoryData[],
    "categoryIds": string[],
    "active": boolean,
    "available": number,
    "assetHash": string,
    "redeems": number,
    "shipping": string,
    "disclaimer"?: string,
    "availableInQuest": boolean,
    "questId"?: string,
    "claims": number,
    "maxClaims": number,
    "isPhysical": boolean,
    "isAsset": boolean,
}

export interface ICollectibleData {
    id: string;
    name: string;
    description: string;
    cost: number;
    promoImageUrl: string;
    available: number;
    redeems: number;
}

// Convert ICollectibleResponse to ICollectibleData where categories contain Collectibles
export const convertCollectiblesResponseToCollectiblesData = (collectiblesResponse: ICollectiableResponse[]): ICollectibleData[] => {
    return collectiblesResponse.filter(collectible => collectible.categories && (collectible.categories.includes(eCollectibleCategories.Collectibles) || collectible.categories.includes(eCollectibleCategories.CommunityCollectibles))).map(collectible => {
        return {
            id: collectible.id,
            name: collectible.name,
            description: collectible.description,
            cost: collectible.cost,
            promoImageUrl: collectible.promoImageUrl,
            available: collectible.available,
            redeems: collectible.redeems
        }
    })
}
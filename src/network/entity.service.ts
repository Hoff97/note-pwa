import { toNetworkData, fromNetworkData, HasIdTimestamp } from "../util/types";
import { loginService } from "./login.service";

export const urlPrefix = 'https://detext.haskai.de/syncify/api';

export class EntityService<T extends HasIdTimestamp> {

    constructor(private name: string) {

    }

    async fetchEntities(): Promise<T[]> {
        const response = await fetch(`${urlPrefix}/entity/?tpe=${this.name}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${loginService.getToken()}`
            }
        });

        const json = await response.json();
        return json.map((x: any) => fromNetworkData(x));
    }

    async createEntity(entity: T): Promise<T> {
        const response = await fetch(`${urlPrefix}/entity/?tpe=${this.name}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${loginService.getToken()}`
            },
            body: JSON.stringify(toNetworkData(entity))
        });

        const json = await response.json();
        return fromNetworkData(json) as any;
    }

    async updateEntity(entity: T): Promise<T> {
        const response = await fetch(`${urlPrefix}/entity/${entity.id}/?tpe=${this.name}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${loginService.getToken()}`
            },
            body: JSON.stringify(toNetworkData(entity))
        });

        const json = await response.json();
        return fromNetworkData(json) as any;
    }

    async deleteEntity(id: string): Promise<void> {
        await fetch(`${urlPrefix}/entity/${id}/?tpe=${this.name}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${loginService.getToken()}`
            }
        });
    }
}
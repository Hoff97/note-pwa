import { HasIdTimestamp, WithoutIdTimestamp } from "../util/types";
import { EntityService } from "./entity.service";
import { loginService } from "./login.service";
import { v4 as uuidv4 } from 'uuid';

export class SyncService<T extends HasIdTimestamp> {
    constructor(private entityService: EntityService<T>, private name: string){

    }

    storeEntities(entities: T[]) {
        localStorage.setItem(this.name, JSON.stringify(entities));
    }

    getEntitiesLocal(): T[] {
        let entities = localStorage.getItem(this.name);
        if (entities === null) {
            entities = "[]";
        }
        return JSON.parse(entities);
    }

    async getEntities(): Promise<T[]> {
        if (loginService.loggedIn()) {
            try {
                let entities = await this.entityService.fetchEntities();

                const localEntities = this.getEntitiesLocal();

                const entMap = this.makeMap(entities);
                const localEntMap = this.makeMap(localEntities);

                const newEnts: T[] = [];
                const localNewEnts: T[] = [];
                const updates: T[] = [];

                for (let localEnt of localEntities) {
                    if (entMap[localEnt.id] !== undefined) {
                        const localDate = new Date(localEnt.timestamp);
                        const remoteDate = new Date(entMap[localEnt.id].timestamp);
                        if (localDate > remoteDate) {
                            updates.push(localEnt);
                        } else {
                            newEnts.push(entMap[localEnt.id]);
                        }
                    } else {
                        localNewEnts.push(localEnt);
                    }
                }

                for (let ent of entities) {
                    if (localEntMap[ent.id] === undefined) {
                        newEnts.push(ent);
                    }
                }

                for (let localNew of localNewEnts) {
                    await this.entityService.createEntity(localNew);
                }
                for (let localUp of updates) {
                    await this.entityService.updateEntity(localUp);
                }

                entities = [
                    ...newEnts,
                    ...localNewEnts,
                    ...updates
                ];

                this.storeEntities(entities);
                return entities;
            } catch (e) {
            }
        }
        return this.getEntitiesLocal();
    }

    genId(): string {
        return uuidv4();
    }

    async createEntity(entity: WithoutIdTimestamp<T>): Promise<string> {
        const copy: T = {
            id: this.genId(),
            timestamp: (new Date()).toISOString(),
            ...entity
        } as any;

        let created;
        if (loginService.loggedIn()) {
            try {
                created = await this.entityService.createEntity(copy);
            } catch (e) {
                created = copy;
            }
        } else {
            created = copy;
        }

        const localEntities = this.getEntitiesLocal();
        localEntities.push(created);

        this.storeEntities(localEntities);

        return created.id;
    }

    async updateEntity(entity: T) {
        entity.timestamp = (new Date()).toISOString();
        if (loginService.loggedIn()) {
            try {
                await this.entityService.updateEntity(entity);
            } catch (e) {
            }
        }

        const entities = this.getEntitiesLocal();

        for (let i = 0; i < entities.length; i++) {
            // eslint-disable-next-line
            if (entities[i].id == entity.id) {
                entities[i] = entity;
                break;
            }
        }

        this.storeEntities(entities);
    }

    getEntity(id: string): T | undefined {
        const entities = this.getEntitiesLocal();

        for (let i = 0; i < entities.length; i++) {
            // eslint-disable-next-line
            if (entities[i].id == id) {
                return entities[i];
            }
        }

        return undefined;
    }

    async deleteEntity(id: string): Promise<T[]> {
        if (loginService.loggedIn()) {
            try {
                await this.entityService.deleteEntity(id);
            } catch {
            }
        }
        const notes = await this.getEntities();

        for (let i = 0; i < notes.length; i++) {
            // eslint-disable-next-line
            if (notes[i].id == id) {
                notes.splice(i, 1);
                break;
            }
        }

        this.storeEntities(notes);

        return notes;
    }

    private makeMap(entities: T[]): {[key: string]: T} {
        const ret: {[key: string]: T} = {};
        for (let entity of entities) {
            ret[entity.id] = entity;
        }
        return ret;
    }
}
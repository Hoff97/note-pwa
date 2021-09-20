import { HasIdTimestamp, WithoutIdTimestamp } from "../util/types";
import { EntityService } from "./entity.service";
import { loginService } from "./login.service";
import { v4 as uuidv4 } from 'uuid';

export function timeOut<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject();
        }, ms);

        promise.then(value => {
            clearTimeout(timeout);
            resolve(value);
        }).catch(reject);
    })
}

const TIMEOUT_MS = 1000;

export class SyncService<T extends HasIdTimestamp> {
    constructor(private entityService: EntityService<T>, private name: string){
        loginService.loggedInEv.subscribe(() => {
            this.getEntities().then(x => {
            });
        });
    }

    storeEntities(entities: T[]) {
        localStorage.setItem(this.name, JSON.stringify(entities));
    }

    getEntitiesLocal(): T[] {
        let entities = localStorage.getItem(this.name);
        if (entities === null) {
            entities = "[]";
        }
        const result: T[] = JSON.parse(entities);
        if (this.entityService.validate !== undefined) {
            const validate = this.entityService.validate;
            return result.map(x => validate(x));
        }
        return result;
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

                const toDelete: T[] = [];

                for (let localEnt of localEntities) {
                    if (localEnt.deleted) {
                        if (entMap[localEnt.id] !== undefined) {
                            toDelete.push(localEnt);
                        }
                    } else if (entMap[localEnt.id] !== undefined) {
                        const localDate = new Date(localEnt.timestamp);
                        const remoteDate = new Date(entMap[localEnt.id].timestamp);
                        if (localDate > remoteDate) {
                            updates.push(localEnt);
                        } else {
                            newEnts.push(entMap[localEnt.id]);
                        }
                    } else if (!localEnt.synchronized) {
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
                for (let delEntity of toDelete) {
                    await this.entityService.deleteEntity(delEntity.id);
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
                created = await timeOut(this.entityService.createEntity(copy),TIMEOUT_MS);
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

        const entities = this.getEntitiesLocal();

        for (let i = 0; i < entities.length; i++) {
            // eslint-disable-next-line
            if (entities[i].id == entity.id) {
                entities[i] = entity;
                break;
            }
        }

        this.storeEntities(entities);

        if (loginService.loggedIn()) {
            try {
                await this.entityService.updateEntity(entity);
            } catch (e) {
            }
        }
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
        let notes = this.getEntitiesLocal();
        for (let i = 0; i < notes.length; i++) {
            // eslint-disable-next-line
            if (notes[i].id == id) {
                notes[i].deleted = true;
            }
        }
        this.storeEntities(notes);

        if (loginService.loggedIn()) {
            try {
                await timeOut(this.entityService.deleteEntity(id), TIMEOUT_MS);

                notes = this.getEntitiesLocal();
                for (let i = 0; i < notes.length; i++) {
                    // eslint-disable-next-line
                    if (notes[i].id == id) {
                        notes.splice(i, 1);
                        break;
                    }
                }
                this.storeEntities(notes);
            } catch {
            }
        }

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
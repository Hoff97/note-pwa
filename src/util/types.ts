export type Color = 'white' | 'red' | 'green' | 'blue' | 'orange';

export const colors: Color[] = ['white', 'red', 'green', 'blue', 'orange'];

export interface HasId {
    id: string;
}

export interface HasTimestamp {
    timestamp: string;
}

export interface HasIdTimestamp extends HasId, HasTimestamp {
    synchronized: boolean;
}

export interface Note extends HasIdTimestamp {
    name: string;
    markdown: string;
    color: Color;
    favorite: boolean;
}

export type NoteType = 'empty' | 'checklist';

export type WithoutIdTimestamp<T> = Omit<Omit<Omit<T, 'id'>, 'timestamp'>, 'synchronized'>;

export interface NetworkData<T extends HasIdTimestamp> {
    id: string;
    timestamp: string;
    data: WithoutIdTimestamp<T>;
}

export function toNetworkData<T extends HasIdTimestamp>(data: T, validate: ((entity: T) => T) | undefined): NetworkData<T> {
    let copy = {
        ...data
    };
    delete copy.id;
    delete copy.timestamp;

    if (validate) {
        copy = validate(copy);
    }

    return {
        id: data.id,
        timestamp: data.timestamp,
        data: copy
    };
}

export function fromNetworkData<T extends HasIdTimestamp>(data: NetworkData<T>, validate: ((entity: T) => T) | undefined): T {
    let result = {
        id: data.id,
        timestamp: data.timestamp,
        synchronized: true,
        ...data.data
    } as any;
    if (validate) {
        result = validate(result);
    }
    return result;
}

export interface NetworkNote extends NetworkData<Note> {

};

export type NewNote = WithoutIdTimestamp<Note>;
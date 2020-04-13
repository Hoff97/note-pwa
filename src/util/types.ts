export type Color = 'white' | 'red' | 'green' | 'blue' | 'orange';

export const colors: Color[] = ['white', 'red', 'green', 'blue', 'orange'];

export interface HasId {
    id: string;
}

export interface HasTimestamp {
    timestamp: string;
}

export interface HasIdTimestamp extends HasId, HasTimestamp {

}

export interface Note extends HasIdTimestamp {
    name: string;
    markdown: string;
    color: Color;
}

export interface NetworkData<T extends HasIdTimestamp> {
    id: string;
    timestamp: string;
    data: Omit<Omit<T, 'id'>, 'timestamp'>;
}

export function toNetworkData<T extends HasIdTimestamp>(data: T): NetworkData<T> {
    const copy = {
        ...data
    };
    delete copy.id;
    delete copy.timestamp;
    
    return {
        id: data.id,
        timestamp: data.timestamp,
        data: copy
    };
}

export function fromNetworkData<T extends HasIdTimestamp>(data: NetworkData<T>): T {
    return {
        id: data.id,
        timestamp: data.timestamp,
        ...data.data
    } as any;
}

export interface NetworkNote extends NetworkData<Note> {

};
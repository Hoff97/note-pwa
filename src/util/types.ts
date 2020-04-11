export type Color = 'white' | 'red' | 'green' | 'blue' | 'orange';

export const colors: Color[] = ['white', 'red', 'green', 'blue', 'orange'];

export interface Note {
    id: number;
    name: string;
    markdown: string;
    color: Color;
}
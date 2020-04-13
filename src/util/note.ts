import { Note } from "./types";

import { uuid } from 'uuidv4';

const localStorageKey = 'notes';

export function saveNotes(notes: Note[]) {
    localStorage.setItem(localStorageKey, JSON.stringify(notes));
}

export function getNotes(): Note[] {
    let notes = localStorage.getItem(localStorageKey);
    if (notes === null) {
        notes = "[]";
    }
    const ret = JSON.parse(notes);
    for (var i = 0; i < ret.length; i++) {
        if (ret[i].color === undefined) {
            ret[i].color = 'white';
        }
    }
    return ret;
}

function genId(): string {
    return uuid();
}

export type NoteType = 'empty' | 'checklist';

export function noteContent(type: NoteType) {
    if (type === 'empty') {
        return '';
    } else {
        return '- [ ] ';
    }
}

export function newNote(markdown: string): string {
    const notes = getNotes();

    const note: Note = {
        id: genId(),
        name: 'New note',
        markdown,
        color: 'white',
        timestamp: (new Date()).toISOString()
    }

    notes.push(note);

    saveNotes(notes);

    return note.id;
}

export function saveNote(note: Note) {
    const notes = getNotes();

    for (let i = 0; i < notes.length; i++) {
        // eslint-disable-next-line
        if (notes[i].id == note.id) {
            notes[i] = note;
            break;
        }
    }

    saveNotes(notes);
}

export function getNote(id: string): Note | undefined {
    const notes = getNotes();

    for (let i = 0; i < notes.length; i++) {
        // eslint-disable-next-line
        if (notes[i].id == id) {
            return notes[i];
        }
    }

    return undefined;
}

export function deleteNote(id: string): Note[] {
    const notes = getNotes();

    for (let i = 0; i < notes.length; i++) {
        // eslint-disable-next-line
        if (notes[i].id == id) {
            notes.splice(i, 1);
            break;
        }
    }

    saveNotes(notes);

    return notes;
}

export function copyNote(id: string): Note[] {
    const notes = getNotes();

    for (let i = 0; i < notes.length; i++) {
        // eslint-disable-next-line
        if (notes[i].id == id) {
            const copy = {
                id: genId(),
                name: notes[i].name + ' - Copy',
                markdown: notes[i].markdown,
                color: notes[i].color,
                timestamp: notes[i].timestamp
            };
            notes.push(copy);
            break;
        }
    }

    saveNotes(notes);

    return getNotes();
}
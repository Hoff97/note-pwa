import { Note } from "./types";

const localStorageKey = 'notes';

export function saveNotes(notes: Note[]) {
    localStorage.setItem(localStorageKey, JSON.stringify(notes));
}

export function getNotes(): Note[] {
    let notes = localStorage.getItem(localStorageKey);
    if (notes === null) {
        notes = "[]";
    }
    return JSON.parse(notes);
}

function genId(notes: Note[]) {
    if (notes.length === 0) {
        return 0;
    } else {
        return notes[notes.length - 1].id + 1;
    }
}

export function newNote(markdown: string): number {
    const notes = getNotes();

    const note = {
        id: genId(notes),
        name: 'New note',
        markdown
    }

    notes.push(note);

    saveNotes(notes);

    return note.id;
}

export function saveNote(note: Note) {
    const notes = getNotes();

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id == note.id) {
            notes[i] = note;
            break;
        }
    }

    saveNotes(notes);
}

export function getNote(id: number): Note | undefined {
    const notes = getNotes();

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id == id) {
            return notes[i];
        }
    }

    return undefined;
}

export function deleteNote(id: number): Note[] {
    const notes = getNotes();

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id == id) {
            notes.splice(i, 1);
            break;
        }
    }

    saveNotes(notes);

    return notes;
}

export function copyNote(id: number): Note[] {
    const notes = getNotes();

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id == id) {
            const copy = {
                id: genId(notes),
                name: notes[i].name + ' - Copy',
                markdown: notes[i].markdown
            };
            notes.push(copy);
            break;
        }
    }

    saveNotes(notes);

    return getNotes();
}
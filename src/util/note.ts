import { EntityService } from "../network/entity.service";
import { SyncService } from "../network/sync.service";
import { Note } from "./types";

function validate(note: Note) {
    if (note.favorite === undefined) {
        note.favorite = false;
    }
    return note;
}

const noteNetworkService = new EntityService<Note>('note', validate);
export const noteService = new SyncService<Note>(noteNetworkService, 'note');
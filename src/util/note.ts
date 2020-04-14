import { EntityService } from "../network/entity.service";
import { SyncService } from "../network/sync.service";
import { Note } from "./types";

const noteNetworkService = new EntityService<Note>('note');
export const noteService = new SyncService<Note>(noteNetworkService, 'note');
import * as React from 'react';
import { Note } from '../../util/types';
import { Route } from 'react-router-dom';
import { getNotes, newNote, deleteNote, copyNote, NoteType, noteContent } from '../../util/note';
import { NotePreview } from '../note-preview/NotePreview';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

import './style.css';
import { fetchNotes, login, createNote } from '../../network/note';

interface HomeState {
    notes: Note[];
    choosing: boolean;
}

export class Home extends React.Component<{}, HomeState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            notes: [],
            choosing: false
        };
    }

    componentDidMount(){
        this.setState({
            notes: getNotes()
        });

        // fetchNotes();
        login('hoff', 'password').then(x => {
            return fetchNotes();
        }).then(x => {
            console.log(x);
            return createNote(x[0]);
        });
    }

    newNote(history: any, type: NoteType = 'empty') {
        const id = newNote(noteContent(type));

        history.push(`/note/${id}`)
    }

    toNote(id: string, history: any) {
        history.push(`/note/${id}`)
    }

    deleteNote(id: string) {
        const notes = deleteNote(id);
        this.setState({
            notes: notes
        });
    }

    copyNote(id: string) {
        const notes = copyNote(id);
        this.setState({
            notes: notes
        });
    }

    render() {
        return <Route render={({ history }) => (
            <div className="home">
                <table className="home">
                    <tbody>
                        <tr className="actions">
                            <td className="actions">
                                <button className="pure-button mr-2" onClick={() => this.newNote(history)}>
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                                <button className="pure-button" onClick={() => this.newNote(history, 'checklist')}>
                                    <FontAwesomeIcon icon={faCheckSquare}/>
                                </button>
                            </td>
                        </tr>
                        {this.state.notes.map(note => {
                            return <tr className="note" key={note.id}>
                                <td className="note" onClick={() => this.toNote(note.id, history)}>
                                    <NotePreview id={note.id} deleteClicked={id => this.deleteNote(id)}/>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )} />;
    }
}
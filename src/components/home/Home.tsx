import * as React from 'react';
import { Note, NewNote, NoteType } from '../../util/types';
import { Route } from 'react-router-dom';
import { NotePreview } from '../note-preview/NotePreview';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckSquare, faUser, faSignOutAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';

import './style.css';
import { loginService } from '../../network/login.service';
import { noteService } from '../../util/note';
import { Tab } from 'react-mde/lib/definitions/types/Tab';

interface HomeState {
    notes: Note[];
    choosing: boolean;
    loggedIn: boolean;
    updating: boolean;
}

export class Home extends React.Component<{}, HomeState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            notes: [],
            choosing: false,
            loggedIn: false,
            updating: true
        };
    }

    componentDidMount(){
        this.setState({
            notes: noteService.getEntitiesLocal(),
            loggedIn: loginService.loggedIn(),
            updating: true
        });

        noteService.getEntities().then(notes => {
            console.log("Updated!");
            this.setState({
                notes,
                updating: false
            });
        });
    }

    async newNote(history: any, type: NoteType = 'empty') {
        this.setState({updating: true});
        const note: NewNote = {
            name: 'New Note',
            markdown: type === 'empty' ? '' : '- [ ] ',
            color: 'white',
            favorite: false,
        }

        const id = await noteService.createEntity(note);

        this.setState({updating: false});

        history.push(`/note/${id}?tab=write`);
    }

    toNote(id: string, history: any, tab: Tab = 'preview') {
        history.push(`/note/${id}?tab=${tab}`);
    }

    async deleteNote(id: string) {
        this.setState({updating: true});
        const notes = await noteService.deleteEntity(id);

        this.setState({
            notes: notes,
            updating: false
        });
    }

    async favoriteNote(id: string) {
        const note = noteService.getEntity(id);
        if (note) {
            note.favorite = !note.favorite;

            this.setState({updating: true});

            await noteService.updateEntity(note);

            this.setState({
                notes: noteService.getEntitiesLocal(),
                updating: false
            });
        }
    }

    login(history: any) {
        history.push(`/login/`)
    }

    logout() {
        loginService.logout();
        this.setState({
            loggedIn: loginService.loggedIn()
        });
    }

    render() {
        const sortedNotes = this.state.notes.sort((a, b) => {
            if (a.favorite) {
                return -1;
            } else if (b.favorite) {
                return 1;
            }
            return new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1;
        });
        const filteredNotes = sortedNotes.filter(x => !x.deleted);

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
                                {this.state.updating ? (
                                    <div className="loading-spinner"><FontAwesomeIcon icon={faSpinner} size="2x" className="loading-spinner-icon"/></div>
                                    ) : (
                                    <></>
                                    )
                                }
                                {!this.state.loggedIn ? (
                                    <button className="pure-button login" onClick={() => this.login(history)}>
                                        <FontAwesomeIcon icon={faUser}/>
                                    </button>
                                    ) : (
                                    <button className="pure-button logout" onClick={() => this.logout()}>
                                        <FontAwesomeIcon icon={faSignOutAlt}/>
                                    </button>
                                    )
                                }
                            </td>
                        </tr>
                        {filteredNotes.map(note => {
                            return <tr className="note" key={note.id}>
                                <td className="note" onClick={() => this.toNote(note.id, history)}>
                                    <NotePreview {...note}
                                        deleteClicked={id => this.deleteNote(id)}
                                        editClicked={id => this.toNote(id, history, 'write')}
                                        favoriteClicked={id => this.favoriteNote(id)}/>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )} />;
    }
}
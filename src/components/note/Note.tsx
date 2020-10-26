import * as React from 'react';

import ReactMde, { commands, TextState, TextApi } from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import { Note, colors, Color } from '../../util/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEyeDropper, faCircle } from '@fortawesome/free-solid-svg-icons'

import './style.css';

import { MarkDownWrap } from '../mdWrap/MarkDownWrap';
import { previousLine, listRegExp, currentLine, lineStart } from '../../util/strs';
import { CommandGroup, GetIcon, Suggestion } from 'react-mde/lib/definitions/types';
import { noteService } from '../../util/note';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Route } from 'react-router-dom';
import { Tab } from 'react-mde/lib/definitions/types/Tab';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../../util/util';

interface NoteState {
    note: Note;
    tab: Tab;
    editTitle: boolean;
    loaded: boolean;
}

export function colorClass(color: Color) {
    return color;
}

export class NoteComponent extends React.Component<{}, NoteState> {
    input?: HTMLTextAreaElement;

    editorRef: React.RefObject<ReactMde>;

    commands: CommandGroup[] = [
        ...commands.getDefaultCommands(),
        {
            commands: [
                {
                    name: 'Test',
                    icon: (_getIconFromProvider: GetIcon) => (
                        <FontAwesomeIcon icon={faEyeDropper}/>
                    ),
                    children: colors.map(color => (
                        {
                            name: 'C1',
                            icon: (getIconFromProvider: GetIcon) => (
                                <span style={{color}}>
                                    <FontAwesomeIcon icon={faCircle}/>
                                </span>
                            ),
                            execute: (state: TextState, api: TextApi) => {
                                this.setColor(color);
                            }
                        }))
                }
            ]
        }
    ];

    constructor(props: any) {
        super(props);

        this.state = {
            note: {
                markdown: '',
                id: '',
                name: 'Placeholder',
                color: 'white',
                timestamp: '',
                synchronized: false,
                favorite: false
            },
            tab: 'write',
            editTitle: false,
            loaded: false
        };

        this.editorRef = React.createRef();
    }

    componentDidMount() {
        const noteId = (this.props as any).match.params.noteId;

        const note = noteService.getEntity(noteId);

        let tab: Tab = 'write';
        if (window.location.search) {
            const urlParams = new URLSearchParams(window.location.search);
            const paramTab = urlParams.get('tab');
            if (paramTab === 'write' || paramTab === 'preview') {
                tab = paramTab;
            }
        }

        if (note) {
            this.setState({
                note,
                tab,
                loaded: true
            });
        }
    }

    componentDidUpdate() {
        let input = document.getElementsByClassName('mde-text');
        if (input.length > 0 && !this.input) {
            this.input = input[0] as HTMLTextAreaElement;

            this.input.addEventListener('keydown', this.handleKeyPress.bind(this));
        }
    }

    handleKeyPress(ev: KeyboardEvent) {
        if (ev.key === 'Enter') {
            setTimeout(() => {
                this.handleEnter(ev);
            }, 10);
        } else if (ev.key === 'Tab') {
            ev.preventDefault();
            setTimeout(() => {
                this.handleTab(ev);
            }, 10);
        }
    }

    handleTab(ev: KeyboardEvent) {
        const position: number = (ev.target as any).selectionStart;

        const note = this.state.note.markdown;

        const currLine = currentLine(note, position);
        if (currLine) {
            const match = currLine.match(listRegExp);
            if (match) {
                const start = lineStart(note, position);
                if (ev.shiftKey) {
                    if (match[1].length >= 4) {
                        const newVal = [note.slice(0, start), note.slice(start+4)].join('');
                        this.setValue(newVal);
                        setTimeout(() => {
                            (ev.target as any).selectionStart =  position - 4;
                            (ev.target as any).selectionEnd =  position - 4;
                        }, 0);
                    }
                } else {
                    const newVal = [note.slice(0, start), '    ', note.slice(start)].join('');
                    this.setValue(newVal);
                    setTimeout(() => {
                        (ev.target as any).selectionStart =  position + 4;
                        (ev.target as any).selectionEnd =  position + 4;
                    }, 0);
                }
            }
        }
    }

    handleEnter(ev: KeyboardEvent) {
        const position: number = (ev.target as any).selectionStart;

        const note = this.state.note.markdown;

        const prevLine = previousLine(note, position);
        if (prevLine) {
            const match = prevLine.match(listRegExp);
            if (match) {
                let str = match[1];
                if (match[5] !== undefined) {
                    str += `${parseInt(match[5]) + 1}. `
                } else if (match[3] !== undefined) {
                    str += `${match[3]} `;
                }
                if (match[6]) {
                    str += `${match[6]} `;
                }
                const newVal = [note.slice(0, position), str, note.slice(position)].join('');

                this.setValue(newVal);
                setTimeout(() => {
                    (ev.target as any).selectionStart =  position + str.length;
                    (ev.target as any).selectionEnd =  position + str.length;
                }, 0);
            }
        }
    }

    setValue(value: string) {
        this.setState({
            note: {
                ...this.state.note,
                markdown: value
            }
        });

        noteService.updateEntity({
            ...this.state.note,
            markdown: value
        });
    }

    setTab(tab: Tab) {
        this.setState({
            tab
        });
    }

    setColor(color: Color) {
        this.setState({
            note: {
                ...this.state.note,
                color
            }
        });

        noteService.updateEntity({
            ...this.state.note,
            color
        });
    }

    toggleEdit() {
        this.setState({
            editTitle: !this.state.editTitle
        });
    }

    setName(value: string) {
        this.setState({
            note: {
                ...this.state.note,
                name: value
            }
        });

        noteService.updateEntity({
            ...this.state.note,
            name: value
        });
    }

    editKeyUp(ev: React.KeyboardEvent) {
        if (ev.nativeEvent.key === 'Enter') {
            this.toggleEdit();
        }
    }

    goBack(ev: React.MouseEvent, history: any) {
        ev.stopPropagation();
        history.goBack();
    }

    insertDate(date: Date | Date[]) {
        if (Array.isArray(date)) {
            date = date[0];
        }

        if (this.editorRef.current) {
            const textArea = this.editorRef.current.textAreaRef;

            const end = textArea.selectionStart;
            let start = end;
            while (start > 0) {
                if (this.state.note.markdown[start] === '@') {
                    break;
                }
                start--;
            }
            const before = this.state.note.markdown.slice(0, start);
            const after = this.state.note.markdown.slice(end);
            const format = formatDate(date) + ' ';
            this.setValue(before + format + after);

            setTimeout(() => {
                textArea.selectionStart = before.length + format.length;
                textArea.selectionEnd = before.length + format.length;
                textArea.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    key: 'Escape'
                }));
            }, 10);
        }
    }

    loadSuggestions(text: string): Promise<Suggestion[]> {
        if (text.length === 0) {
            return Promise.resolve([
                {
                    preview: (
                        <div onClick={ev => ev.stopPropagation()}>
                            <Calendar
                                onChange={date => this.insertDate(date)}/>
                        </div>
                    ),
                    value: '('
                }
            ]);
        }
        return Promise.resolve([]);
    }

    render() {
        if (!this.state.loaded) {
            return (<></>);
        }

        let title: any;
        if (!this.state.editTitle) {
            title = (history: any) => (
                <div className="note-title" onClick={() => this.toggleEdit()}>
                    <button className="pure-button" onClick={ev => this.goBack(ev, history)}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </button>
                    <div className="edit-region">
                        {this.state.note.name}
                        <span className="edit">
                            <FontAwesomeIcon icon={faPen}/>
                        </span>
                    </div>
                </div>
            );
        } else {
            title = (history: any) => (
                <div className="note-title">
                    <input value={this.state.note.name}
                        onChange={val => this.setName(val.target.value)}
                        onKeyUp={ev => this.editKeyUp(ev)}
                        autoFocus={true}
                        className="editName"/>
                    <span className="edit">
                        <FontAwesomeIcon icon={faPen}/>
                    </span>
                </div>
            )
        }

        const lines = this.state.note.markdown.split('\n').length;

        const maxHeight = window.innerHeight - 200;
        const minHeight = Math.min(maxHeight, Math.max(300, lines*22));

        return (
            <Route render={({ history }) => (
                <div>
                    {title(history)}
                    <ReactMde
                        value={this.state.note.markdown}
                        onChange={ev => this.setValue(ev)}
                        selectedTab={this.state.tab}
                        onTabChange={ev => this.setTab(ev)}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(
                                <MarkDownWrap
                                    value={markdown}
                                    onChange={value => this.setValue(value)}/>
                            )
                        }
                        commands={this.commands}
                        classes={{
                            textArea: colorClass(this.state.note.color),
                            preview: colorClass(this.state.note.color)
                        }}
                        suggestionTriggerCharacters={['@']}
                        loadSuggestions={(text: string) => this.loadSuggestions(text)}
                        ref={this.editorRef}
                        minEditorHeight={minHeight}
                        maxEditorHeight={maxHeight}
                    />
                </div>
            )}/>
        );
    }
}
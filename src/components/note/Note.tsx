import * as React from 'react';

import ReactMde, { commands, TextState, TextApi } from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import { Note, colors, Color } from '../../util/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEyeDropper, faCircle } from '@fortawesome/free-solid-svg-icons'

import './style.css';

import { MarkDownWrap } from '../mdWrap/MarkDownWrap';
import { previousLine, listRegExp, currentLine, lineStart } from '../../util/strs';
import { CommandGroup, GetIcon } from 'react-mde/lib/definitions/types';
import { noteService } from '../../util/note';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Route } from 'react-router-dom';

type Tab = 'write' | 'preview';

interface NoteState {
    note: Note;
    tab: Tab;
    editTitle: boolean;
}

export function colorClass(color: Color) {
    return color;
}

export class NoteComponent extends React.Component<{}, NoteState> {
    input?: HTMLTextAreaElement;

    commands: CommandGroup[] = [
        ...commands.getDefaultCommands(),
        {
            commands: [
                {
                    name: 'Test',
                    icon: (getIconFromProvider: GetIcon) => (
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
                synchronized: false
            },
            tab: 'write',
            editTitle: false
        };
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
                tab
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

    render() {
        let title: any;
        if (!this.state.editTitle) {
            title = (history: any) => (
                <div className="note-title" onClick={() => this.toggleEdit()}>
                    <button className="pure-button" onClick={ev => this.goBack(ev, history)}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </button>
                    {this.state.note.name}
                    <span className="edit">
                        <FontAwesomeIcon icon={faPen}/>
                    </span>
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
                    />
                </div>
            )}/>
        );
    }
}
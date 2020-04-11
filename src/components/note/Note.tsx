import * as React from 'react';

import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import { getNote, saveNote } from '../../util/note';
import { Note } from '../../util/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons'

import './style.css';

import { MarkDownWrap } from '../mdWrap/MarkDownWrap';
import { previousLine, listRegExp, currentLine, lineStart } from '../../util/strs';

type Tab = 'write' | 'preview';

interface NoteState {
    note: Note;
    tab: Tab;
    editTitle: boolean;
}

export class NoteComponent extends React.Component<{}, NoteState> {
    input?: HTMLTextAreaElement;

    constructor(props: any) {
        super(props);

        this.state = {
            note: {
                markdown: '',
                id: -1,
                name: 'Placeholder'
            },
            tab: 'write',
            editTitle: false
        };
    }

    componentDidMount() {
        const noteId = (this.props as any).match.params.noteId;

        const note = getNote(noteId);

        if (note) {
            this.setState({
                note
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
        console.log(ev);
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
                console.log(match);
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
                if (match[4] !== undefined) {
                    str += `${parseInt(match[4]) + 1}. `
                } else {
                    str += `${match[2]} `;
                }
                if (match[5]) {
                    str += `${match[5]} `;
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

        saveNote({
            ...this.state.note,
            markdown: value
        });
    }

    setTab(tab: Tab) {
        this.setState({
            tab
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

        saveNote({
            ...this.state.note,
            name: value
        });
    }

    editKeyUp(ev: React.KeyboardEvent) {
        if (ev.nativeEvent.key === 'Enter') {
            this.toggleEdit();
        }
    }

    render() {
        let title;
        if (!this.state.editTitle) {
            title = (
                <div className="note-title" onClick={() => this.toggleEdit()}>
                    {this.state.note.name}
                    <span className="edit">
                        <FontAwesomeIcon icon={faPen}/>
                    </span>
                </div>
            );
        } else {
            title = (
                <div className="note-title">
                    <input value={this.state.note.name}
                        onChange={val => this.setName(val.target.value)}
                        onKeyUp={ev => this.editKeyUp(ev)}
                        autoFocus={true}/>
                    <span className="edit">
                        <FontAwesomeIcon icon={faPen}/>
                    </span>
                </div>
            )
        }

        return (
            <div>
                {title}
                <ReactMde
                    value={this.state.note.markdown}
                    onChange={ev => this.setValue(ev)}
                    selectedTab={this.state.tab}
                    onTabChange={ev => this.setTab(ev)}
                    generateMarkdownPreview={markdown =>
                        Promise.resolve(
                            <MarkDownWrap value={this.state.note.markdown}
                                onChange={value => this.setValue(value)}/>
                        )
                    }
                />
            </div>
        );
    }
}
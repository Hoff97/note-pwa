import * as React from 'react';

import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import ReactMarkdown from 'react-markdown';
import { getNote, saveNote } from '../../util/note';
import { Note } from '../../util/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons'

import './style.css';


import {listItem as defaultListItem} from 'react-markdown/lib/renderers';
import { CheckBox } from '../checkbox/checkbox';

type Tab = 'write' | 'preview';

interface NoteState {
    note: Note;
    tab: Tab;
    editTitle: boolean;
}

function generateCheckbox(checked: boolean) {
    return checked ? '- [x]' : '- [ ]';
}


export class NoteComponent extends React.Component<{}, NoteState> {
    renderListItem = (props: any) => {
        if (props.checked !== null && props.checked !== undefined) {
            const lineIndex = props.sourcePosition.start.line - 1;
            return (
                <li><CheckBox checked={props.checked} onChange={ev => this.toggleCheckbox(ev, lineIndex, props.checked)}/></li>
            );
        }
        // otherwise default to list item
        return defaultListItem(props);
      }

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

    toggleCheckbox(ev: any, lineIndex: number, checked: boolean) {
        const lines = this.state.note.markdown.split('\n');

        lines[lineIndex] = lines[lineIndex].replace(
            generateCheckbox(checked),
            generateCheckbox(!checked)
        );
        this.setValue(lines.join('\n'));
        
        this.setTab('write');
        setTimeout(() => {
            this.setTab('preview');
        }, 0);
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
                            <ReactMarkdown source={markdown}
                                renderers={{listItem: this.renderListItem}}
                                rawSourcePos={true}/>
                        )
                    }
                />
            </div>
        );
    }
}
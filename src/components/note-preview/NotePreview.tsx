import React from 'react';

import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import { MarkDownWrap } from '../mdWrap/MarkDownWrap';
import { colorClass } from '../note/Note';
import { Color } from '../../util/types';
import { noteService } from '../../util/note';

interface NotePreviewProps {
    id: string;
    deleteClicked: (id: string) => void;
    editClicked: (id: string) => void;
}

interface NotePreviewState {
    markdown: string;
    name: string;
    color: Color;
}

export class NotePreview extends React.Component<NotePreviewProps, NotePreviewState> {
    constructor(props: any) {
        super(props);

        this.state = {
            markdown: '',
            name: '',
            color: 'white'
        };

        const note = noteService.getEntity(this.props.id);

        if (note) {
            this.state = {
                markdown: note.markdown,
                name: note.name,
                color: note.color
            };
        }
    }

    edit(ev: React.MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.editClicked(this.props.id);
    }

    delete(ev: React.MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.deleteClicked(this.props.id);
    }

    render() {
        return (
            <div className={`preview ${colorClass(this.state.color)}`}>
                <div className="title">
                    {this.state.name}
                    <span className="delete" onClick={ev => this.delete(ev)}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </span>
                    <span className="edit-preview" onClick={ev => this.edit(ev)}>
                        <FontAwesomeIcon icon={faEdit}/>
                    </span>
                </div>
                <MarkDownWrap
                    value={this.state.markdown}
                    onChange={() => {}}/>
            </div>
        );
    }
}
import React from 'react';

import { getNote } from "../../util/note";

import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { MarkDownWrap } from '../mdWrap/MarkDownWrap';

interface NotePreviewProps {
    id: number;
    deleteClicked: (id:  number) => void;
}

interface NotePreviewState {
    markdown: string;
    name: string
}

export class NotePreview extends React.Component<NotePreviewProps, NotePreviewState> {
    constructor(props: any) {
        super(props);

        this.state = {
            markdown: '',
            name: ''
        };

        const note = getNote(this.props.id);

        if (note) {
            this.state = {
                markdown: note.markdown,
                name: note.name
            };
        }
    }

    delete(ev: React.MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.deleteClicked(this.props.id);
    }

    render() {
        return (
            <div className="preview">
                <div className="title">
                    {this.state.name}
                    <span className="delete" onClick={ev => this.delete(ev)}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </span>
                </div>
                <MarkDownWrap value={this.state.markdown} onChange={() => {}}/>
            </div>
        );
    }
}
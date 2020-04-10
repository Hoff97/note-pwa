import React from 'react';

import { getNote } from "../../util/note";
import ReactMarkdown from 'react-markdown';

import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'

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
    }

    componentDidMount() {
        const note = getNote(this.props.id);

        if (note) {
            this.setState({
                markdown: note.markdown,
                name: note.name
            });
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
                <ReactMarkdown source={this.state.markdown} />
            </div>
        );
    }
}
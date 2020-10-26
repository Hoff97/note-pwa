import React from 'react';

import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { MarkDownWrap } from '../mdWrap/MarkDownWrap';
import { colorClass } from '../note/Note';
import { Color } from '../../util/types';
import { noteService } from '../../util/note';

interface NotePreviewProps {
    id: string;
    markdown: string,
    name: string,
    color: Color,
    favorite: boolean,
    deleteClicked: (id: string) => void;
    editClicked: (id: string) => void;
    favoriteClicked: (id: string) => void;
}

export class NotePreview extends React.Component<NotePreviewProps> {
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

    favorite(ev: React.MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.favoriteClicked(this.props.id);
    }

    render() {
        return (
            <div className={`preview ${colorClass(this.props.color)}`}>
                <div className="title">
                    {this.props.name}
                    <span className="favorite" onClick={ev => this.favorite(ev)}>
                        <FontAwesomeIcon icon={this.props.favorite ? faStar : (faStarOutline as any)} />
                    </span>
                    <span className="delete" onClick={ev => this.delete(ev)}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </span>
                    <span className="edit-preview" onClick={ev => this.edit(ev)}>
                        <FontAwesomeIcon icon={faEdit}/>
                    </span>
                </div>
                <MarkDownWrap
                    value={this.props.markdown}
                    onChange={() => {}}/>
            </div>
        );
    }
}
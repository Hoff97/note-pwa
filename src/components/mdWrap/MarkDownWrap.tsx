import * as React from 'react';

import ReactMarkdown from 'react-markdown';


import {listItem as defaultListItem} from 'react-markdown/lib/renderers';
import { CheckBox } from '../checkbox/checkbox';

interface MDState {
    value: string;
}

interface MDProps {
    value: string;
    onChange: (value: string) => void;
}

function generateCheckbox(checked: boolean) {
    return checked ? '- [x]' : '- [ ]';
}


export class MarkDownWrap extends React.Component<MDProps, MDState> {
    renderListItem = (props: any) => {
        if (props.checked !== null && props.checked !== undefined) {
            const lineIndex = props.sourcePosition.start.line - 1;
            return (
                <li><CheckBox
                    checked={props.checked} 
                    onChange={ev => this.toggleCheckbox(ev, lineIndex, props.checked)}
                    children={props.children}/></li>
            );
        }
        // otherwise default to list item
        return defaultListItem(props);
      }

    constructor(props: any) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    setValue(value: string) {
        this.setState({
            value
        });

        this.props.onChange(value);
    }

    toggleCheckbox(ev: React.ChangeEvent<HTMLInputElement>, lineIndex: number, checked: boolean) {
        const lines = this.state.value.split('\n');

        lines[lineIndex] = lines[lineIndex].replace(
            generateCheckbox(checked),
            generateCheckbox(!checked)
        );
        this.setValue(lines.join('\n'));
    }

    render() {
        return (
            <ReactMarkdown source={this.state.value}
                renderers={{listItem: this.renderListItem}}
                rawSourcePos={true}/>
        );
    }
}
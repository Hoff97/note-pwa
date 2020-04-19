import * as React from 'react';

import ReactMarkdown from 'react-markdown';

import './style.css';
import { dates } from '../../util/plugin';

import 'react-calendar/dist/Calendar.css';

import { DateComponent } from '../renderers/Date';
import { formatNumber } from '../../util/util';
import { Link } from '../renderers/Link';
import { ListItem } from '../renderers/ListItem';

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

type ChangeInput = React.ChangeEvent<HTMLInputElement>;

export class MarkDownWrap extends React.Component<MDProps, MDState> {
    renderParagraph = (props: any) => {
        return (
            <>
                {props.children}<br/>
            </>
        );
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

    toggleCheckbox(ev: ChangeInput, lineIndex: number, props: any) {
        const lines = this.state.value.split('\n');

        lines[lineIndex] = lines[lineIndex].replace(
            generateCheckbox(props.checked),
            generateCheckbox(!props.checked)
        );
        this.setValue(lines.join('\n'));
    }

    setDate(date: Date, sourcePosition: any) {
        const before = this.state.value.slice(0, sourcePosition.start.offset);
        const after = this.state.value.slice(sourcePosition.end.offset)
        const format = `@date(${date.getFullYear()},${formatNumber(date.getMonth() + 1)},${formatNumber(date.getDate())})`;

        this.setValue(before + format + after);
    }

    render() {
        return (
            <ReactMarkdown source={this.state.value}
                renderers={{
                    listItem: props => {
                        return (
                            <ListItem
                                toggleCheckbox={(ev: ChangeInput, lineIndex: number, props: any) => this.toggleCheckbox(ev, lineIndex, props)}
                                {...props}/>
                        );
                    },
                    link: Link,
                    paragraph: this.renderParagraph,
                    date: props => {
                        return (
                            <DateComponent
                                setDate={(date: Date, sp: any) => this.setDate(date, sp)}
                                {...props}/>
                        );
                    }
                }}
                rawSourcePos={true}
                plugins={[dates]}/>
        );
    }
}
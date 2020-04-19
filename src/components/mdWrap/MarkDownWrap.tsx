import * as React from 'react';

import ReactMarkdown from 'react-markdown';

import {listItem as defaultListItem} from 'react-markdown/lib/renderers';
import { CheckBox } from '../checkbox/checkbox';

import './style.css';
import { dates } from '../../util/plugin';

import 'react-calendar/dist/Calendar.css';

import { DateComponent } from '../renderers/Date';
import { formatNumber } from '../../util/util';
import { Link, isPreviewLink } from '../renderers/Link';

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

function isNoLabel(child: any) {
    return child.key.startsWith('list') || (child.key.startsWith('link') && isPreviewLink(child.props));
}

export class MarkDownWrap extends React.Component<MDProps, MDState> {
    renderListItem = (props: any) => {
        if (props.checked !== null && props.checked !== undefined) {
            const lineIndex = props.sourcePosition.start.line - 1;
            let labels = props.children.filter((child: any) => !isNoLabel(child));
            let lists = props.children.filter((child: any) => isNoLabel(child));

            if (labels.length === 0) {
                labels.push((
                    <span key={`placeholder-${props.sourcePosition.start.line}`}>
                        &nbsp;
                    </span>
                ));
            }

            return (
                <li>
                    <CheckBox
                        checked={props.checked}
                        onChange={ev => this.toggleCheckbox(ev, lineIndex, props)}
                        labels={labels}/>
                    {lists}
                </li>
            );
        }
        return defaultListItem(props);
      }

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

    toggleCheckbox(ev: React.ChangeEvent<HTMLInputElement>, lineIndex: number, props: any) {
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
                    listItem: this.renderListItem,
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
import * as React from 'react';

import ReactMarkdown from 'react-markdown';


import {listItem as defaultListItem} from 'react-markdown/lib/renderers';
import { CheckBox } from '../checkbox/checkbox';

import { ReactTinyLink } from 'react-tiny-link';

import './style.css';

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
    return child.key.startsWith('list') || (child.key.startsWith('link') && child.props.children.length === 0);
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
        // otherwise default to list item
        return defaultListItem(props);
      }

    renderLink = (props: any) => {
        if (props.children.length === 0) {
            return (
                <div className="react-tiny-link-wrap">
                    <ReactTinyLink
                        cardSize="small"
                        showGraphic={true}
                        maxLine={2}
                        minLine={1}
                        url={props.href}
                        />
                </div>
            );
        } else {
            return (
                <a href={props.href}>
                    {props.children}
                </a>
            );
        }
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

    render() {
        return (
            <ReactMarkdown source={this.state.value}
                renderers={{
                    listItem: this.renderListItem,
                    link: this.renderLink,
                    paragraph: this.renderParagraph
                }}
                rawSourcePos={true}/>
        );
    }
}
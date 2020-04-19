import * as React from 'react';

import { isPreviewLink } from "./Link";

import {listItem as defaultListItem} from 'react-markdown/lib/renderers';
import { CheckBox } from '../checkbox/checkbox';

function isNoLabel(child: any) {
    return child.key.startsWith('list') || (child.key.startsWith('link') && isPreviewLink(child.props));
}

export function ListItem(props: any) {
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
                    onChange={ev => props.toggleCheckbox(ev, lineIndex, props)}
                    labels={labels}/>
                {lists}
            </li>
        );
    }
    return defaultListItem(props);
  }
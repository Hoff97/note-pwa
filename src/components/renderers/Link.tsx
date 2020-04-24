import * as React from 'react';

import { ReactTinyLink } from 'react-tiny-link';

export function isPreviewLink(props: any) {
    return props.children.length === 0 ||
        (props.children.length === 1 && props.children[0].props.children === props.href);
}

export function Link(props: any) {
    if (isPreviewLink(props)) {
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
import * as React from 'react';

import Tooltip from 'react-tooltip-lite';

import Calendar from 'react-calendar';

import './date.css';
import { formatNumber } from '../../util/util';

import 'react-calendar/dist/Calendar.css';

export class DateComponent extends React.Component<any, {}> {
    render() {
        const date = new Date(this.props.year, this.props.month, this.props.day);

        return (
            <span className="date">
                <Tooltip
                        content={
                            <Calendar
                                value={date}
                                onClickDay={date => this.props.setDate(date, this.props.sourcePosition)}/>
                        }
                        eventToggle="onClick">
                    <span>{formatNumber(this.props.day)}.{formatNumber(this.props.month + 1)}.{this.props.year}</span>
                </Tooltip>
            </span>
        );
    }
}
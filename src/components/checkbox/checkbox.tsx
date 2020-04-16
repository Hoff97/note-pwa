import * as React from 'react';

import './style.css';

interface CheckboxProps {
    checked: boolean;
    onChange: (change: React.ChangeEvent<HTMLInputElement>) => void;
    labels: JSX.Element[];
}

export function CheckBox({ checked, onChange, labels }: CheckboxProps) {
    return (
        <label className="checkbox-container">{labels}
            <input type="checkbox" checked={checked}
                onChange={ev => onChange(ev)}/>
            <span className="checkbox-checkmark"></span>
        </label>
    );
}
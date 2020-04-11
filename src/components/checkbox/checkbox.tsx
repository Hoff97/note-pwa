import * as React from 'react';

import './style.css';

interface CheckboxProps {
    checked: boolean;
    children: JSX.Element[];
    onChange: (change: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CheckBox({ checked, onChange, children }: CheckboxProps) {
    return (
        <label className="checkbox-container">{children}
            <input type="checkbox" checked={checked} onChange={ev => onChange(ev)}/>
            <span className="checkbox-checkmark"></span>
        </label>
    );
}
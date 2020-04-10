import * as React from 'react';

import './style.css';

interface CheckboxProps {
    checked: boolean;
    onChange: (change: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CheckBox({ checked, onChange }: CheckboxProps) {
    return (
        <label className="checkbox-container">One
            <input type="checkbox" checked={checked} onChange={ev => onChange(ev)}/>
            <span className="checkbox-checkmark"></span>
        </label>
    );
}
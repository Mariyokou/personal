import React from 'react'

export function RadioButtonGroup(props) {
    return (
        <div>
            <span className="font-bold">{props.label}</span>
            { props.options.map((option) => (
                <label key={option.value}>
                    <input
                        type="radio"
                        name={props.name}
                        value={option.value}
                        checked={props.selectedValue === option.value}
                        onChange={props.onChange}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    )
}

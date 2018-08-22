import PropTypes from 'prop-types';
import React, { Component } from 'react';
import t from 'tcomb-form';

function renderInput(locals) {

    const onChange = function (event) {
        locals.onChange(event.target.value);
    };

    return <div>
        <input type="text" label={locals.label} name={locals.attrs.name} value={locals.value} onChange={onChange}
               style={{display: 'none'}}/>
        <input type="text" id={'virtual-keyboard-helper-' + locals.attrs.name} value={locals.value}
               className="form-control" label={locals.label} onChange={onChange} onBlur={onChange}/>
    </div>;
}

const textboxTemplate = t.form.Form.templates.textbox.clone({renderInput})

export default class VirtualKeyboardFactory extends t.form.Textbox {

    getTemplate() {
        return textboxTemplate
    }
}

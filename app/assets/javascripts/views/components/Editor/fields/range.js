import PropTypes from 'prop-types';
import React, { Component } from 'react';
import t from 'tcomb-form';

function renderInput(locals) {

    const onChange = function (e) {
        locals.onChange(e.target.value);
    };

    return <div>
        {locals.value}
        <input id="slider1" onChange={onChange} value={locals.value} type="range" min="10" max="4000" step="10"/>
    </div>;
}

const rangeTemplate = t.form.Form.templates.textbox.clone({renderInput})

export default class RangeSelectorFactory extends t.form.Textbox {

    getTemplate() {
        return rangeTemplate
    }
}
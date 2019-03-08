import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';
import selectn from 'selectn';

import Preview from 'views/components/Editor/Preview';

/**
 * Define auto-suggest factory
 */
const renderInput = function renderInput(locals) {

    let fileObj = selectn('context.otherContext.file', locals);
    let type = "FVPicture";

    let content = <div>
        <Preview expandedValue={fileObj} type={type} crop={true} minimal={(!fileObj) ? false : true}
                 tagStyles={(type == 'FVPicture') ? {height: '200px'} : null}/>
    </div>;

    return <div
        style={{width: '100%', border: '1px dashed #dedede', padding: '10px', position: 'relative'}}>{content}</div>;
}

const textboxTemplate = t.form.Form.templates.textbox.clone({renderInput})
const textboxTemplateDefault = t.form.Form.templates.textbox

export default class FileFactory extends t.form.Textbox {

    getTemplate() {
        let locals = this.getLocals();
        let fileObj = selectn('context.otherContext.file', locals);

        if (fileObj) {
            return textboxTemplate;
        } else {
            return textboxTemplateDefault;
        }
    }
}

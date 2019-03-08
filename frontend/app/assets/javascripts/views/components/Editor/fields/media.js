import React from 'react';
import t from 'tcomb-form';
import selectn from 'selectn';

import FontIcon from 'material-ui/lib/font-icon';
import FlatButton from 'material-ui/lib/flat-button';

import AddMediaComponent from 'views/components/Editor/AddMediaComponent';
import SelectMediaComponent from 'views/components/Editor/SelectMediaComponent';
import Preview from 'views/components/Editor/Preview';
import IntlService from "views/services/intl";

const expandedValues = [];
const intl = IntlService.instance;

/**
 * Define auto-suggest factory
 */
function renderInput(locals) {

    const _onRequestEdit = function (event) {
        locals.onChange(null);
    }

    const onComplete = function (fullValue) {
        locals.onChange(fullValue.uid);
        locals.setExpandedValue(fullValue, fullValue.uid);
    };

    const onCancel = function () {

        let initialValue = selectn('context.initialValues.' + locals.attrs.name, locals);

        if (initialValue)
            locals.onChange(initialValue);
    };

    let content = <div>
        <Preview id={locals.value} expandedValue={selectn(locals.value, expandedValues)} type={locals.type} crop={true}
                 tagStyles={(locals.type == 'FVPicture') ? {height: '200px'} : null}/>
        <FlatButton style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '0 0 0 10px',
            border: '1px dashed #dedede',
            paddingLeft: '5px',
            textAlign: 'center',
            borderTop: 0,
            borderRight: 0
        }} onTouchTap={_onRequestEdit} label={intl.trans('replace', 'Replace', 'first')} labelPosition="after">
            <FontIcon style={{verticalAlign: 'middle'}} className="material-icons">swap_horiz</FontIcon>
        </FlatButton>
    </div>;

    if (!locals.value) {
        content = <div>
            <AddMediaComponent type={locals.type} label={intl.trans('views.components.editor.upload_new', 'Upload New')}
                               onComplete={onComplete} dialect={locals.context}/>
            <SelectMediaComponent type={locals.type}
                                  label={intl.trans('views.components.editor.browse_existing', 'Browse Existing')}
                                  onComplete={onComplete}
                                  dialect={locals.context}/>
            {(selectn('context.initialValues.' + locals.attrs.name, locals)) ?
                <FlatButton onTouchTap={onCancel} label={intl.trans('cancel', 'Cancel', 'first')}/> : ''}
        </div>;
    }

    return <div
        style={{width: '100%', border: '1px dashed #dedede', padding: '10px', position: 'relative'}}>{content}</div>;
}

const mediaTemplate = t.form.Form.templates.textbox.clone({renderInput})

export default class MediaFactory extends t.form.Textbox {

    constructor(props) {
        super(props);
        this.state = Object.assign(this.state, {expandedValue: null});

        this.setExpandedValue = this.setExpandedValue.bind(this);
    }

    setExpandedValue(expandedValue, uid) {
        expandedValues[uid] = expandedValue;
        this.setState({expandedValue});
    }

    /*
      componentWillReceiveProps(props) {
        if (props.type !== this.props.type) {
          this.typeInfo = getTypeInfo(props.type)
        }
        const value = this.getTransformer().format(props.value)
        this.setState({ value })

        console.log(expandedValues[value]);
      }*/

    getLocals() {
        const locals = super.getLocals();
        locals.attrs = this.getAttrs();
        locals.setExpandedValue = this.setExpandedValue;
        locals.attrs.expandedValue = this.state.expandedValue;

        return locals;
    }

    getTemplate() {
        return mediaTemplate
    }
}
import React, {Component, PropTypes} from 'react';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';
import DOMPurify from 'dompurify';

import Preview from 'views/components/Editor/Preview';
import StatusBar from 'views/components/StatusBar';

// Models
import {Document} from 'nuxeo';

// Schemas
import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

import IconButton from 'material-ui/lib/icon-button';
import CircularProgress from 'material-ui/lib/circular-progress';
import IntlService from "views/services/intl";

const intl = IntlService.instance;

const RenderRegular = function (currentValue, preview, previewType, returnWrapper = 'span') {
    let output = [];
    let values = [];

    if (!Array.isArray(currentValue)) {
        values[0] = currentValue;
    } else {
        values = currentValue;
    }

    output = values.map(function (value, i) {

        let id = (value && value.hasOwnProperty('uid') ? value.uid : value);

        return (preview) ? <Preview key={i} id={id} type={previewType}/> : React.createElement(returnWrapper, {
            key: i,
            dangerouslySetInnerHTML: {__html: DOMPurify.sanitize(value)}
        });
    });

    return output;
}

@provide
export default class EditableComponent extends Component {

    static propTypes = {
        computeEntity: PropTypes.object.isRequired,
        updateEntity: PropTypes.func.isRequired,
        property: PropTypes.string.isRequired,
        sectionProperty: PropTypes.string,
        context: PropTypes.object,
        className: PropTypes.string,
        options: PropTypes.array,
        accessDenied: PropTypes.bool,
        showPreview: PropTypes.bool,
        previewType: PropTypes.string
    };

    static defaultProps = {
        accessDenied: false,
        className: '',
        showPreview: false
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            editModeEnabled: false,
            savedValue: null
        };

        // Bind methods to 'this'
        ['_onEditRequest', '_onRequestSaveField'].forEach((method => this[method] = this[method].bind(this)));
    }

    /**
     * Allows an element to be rendered as regular text or as an editable form, derived from a larger type (e.g. fv-portal:about from FVPortal type)
     * Note: This will only work with 'properties' from the document as they are the only mutable fields.
     * @param {property} string - The property field id (used for Structs)
     * @param {entity} doc - The entitiy to derive current values from, Nuxeo doc object
     * @returns - Element to be rendered
     */
    _editableElement() {

        const {property} = this.props;

        let entity = selectn('response', this.props.computeEntity);

        // If still computing, return spinner
        if (entity.isFetching)
            return <CircularProgress mode="indeterminate" size={2}/>;

        // Get current value for field from properties
        let currentValue = selectn(property, this.state.savedValue) || selectn("properties." + property, entity);

        // Get all options for type from entity field definition
        let fieldFormOptions = selectn(entity.type, options);

        // Handle edit mode
        if (this.state.editModeEnabled && !this.props.accessDenied) {

            let fieldFormValues = {};
            let fieldFormStruct, fieldFormFields = null;

            // Get all fields for type from entity field definition
            fieldFormFields = selectn(entity.type, fields);

            // If fields and options found, try to create form our of field
            if (fieldFormFields && fieldFormOptions) {
                // If extended options enabled
                if (this.props.options && this.props.options.length > 0) {
                    fieldFormOptions.fields[property].options = this.props.options;
                }

                // Create a sub-structure for this field
                let newFieldFormSchema = {};

                // Set field to be new schema (note: selectn doesn't work with functions defined in maps)
                newFieldFormSchema[property] = fieldFormFields[property];

                if (newFieldFormSchema) {

                    // Create a new sub-structure for schema
                    fieldFormStruct = t.struct(newFieldFormSchema);

                    // Set default value to current value
                    fieldFormValues[property] = currentValue;

                    return <form className="editableComponentForm"
                                 onSubmit={e => this._onRequestSaveField(e, property)}>
                        <t.form.Form
                            ref={"form_" + property}
                            value={fieldFormValues}
                            type={fieldFormStruct}
                            context={selectn('response', this.props.context) || selectn('response', this.props.computeEntity)}
                            options={fieldFormOptions}/>
                        <button type="submit" className="btn btn-primary">{intl.trans('save', 'Save', 'first')}</button>
                    </form>;
                }
            }
        }

        // Render regular field if not in edit mode
        return <div>
            {RenderRegular(currentValue, this.props.showPreview, this.props.previewType)}
            <IconButton iconClassName="material-icons" iconStyle={{fontSize: '20px'}} style={{
                verticalAlign: '-4px',
                margin: '0 5px 0 -5px',
                padding: '0px 5px',
                height: '22px',
                width: '22px',
                display: (this.props.accessDenied) ? 'none' : 'inline-block'
            }} onTouchTap={this._onEditRequest.bind(this, property)}
                        tooltip={intl.trans('edit', 'Edit', 'first')}>mode_edit</IconButton>
        </div>;
    }

    shouldComponentUpdate(newProps, newState) {

        if (newState != this.state || newProps.computeEntity.response != this.props.computeEntity.response)
            return true;

        if (newProps.options != null)
            return true;

        return false;
    }

    _onRequestSaveField(e, property) {

        // Prevent default behaviour
        e.preventDefault();

        // TODO: Find better way to construct object then accessing internal function
        // Create new document rather than modifying the original document
        let newDocument = new Document(this.props.computeEntity.response, {
            'repository': this.props.computeEntity.response._repository,
            'nuxeo': this.props.computeEntity.response._nuxeo
        });

        let formValue = this.refs["form_" + property].getValue();

        // Set new value property on document
        newDocument.set(formValue);

        // Save document
        this.props.updateEntity(newDocument, null, '\'' + selectn('props.options.fields' + '.' + property + '.label', this.refs["form_" + property]) + '\' updated successfully!');

        this.setState({
            editModeEnabled: false,
            savedValue: formValue
        });
    }

    _onEditRequest(fieldToEdit) {
        this.setState({
            editModeEnabled: true
        });
    }

    render() {
        return (<div className={this.props.className}>{this._editableElement()} <StatusBar
            message={selectn('message', this.props.computeEntity)}/></div>);
    };
}

export class EditableComponentHelper extends Component {
    render() {
        if (this.props.isSection) {
            return <div>{RenderRegular(selectn(this.props.sectionProperty || 'properties.' + this.props.property, this.props.entity), this.props.showPreview, this.props.previewType, 'div')}</div>;
        }

        return <EditableComponent {...this.props} />;
    }
}
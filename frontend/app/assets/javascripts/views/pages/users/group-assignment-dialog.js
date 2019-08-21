/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable, { Map } from 'immutable'
import classNames from 'classnames'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import t from 'tcomb-form'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

/**
 * Custom select form field
 */
function renderSelect(locals) {
  const onChange = function(value) {
    locals.onChange(value)
  }

  if (!locals.value) {
    return (
      <select type="select-multiple" {...locals.attrs}>
        {this.renderOptions(locals)}
      </select>
    )
  }
  return <div>{StringHelpers.toTitleCase(locals.value.replace(/_/g, ' '))}</div>
}

const selectGroupTemplate = t.form.Form.templates.select.clone({ renderSelect })

class SelectGroupFactory extends t.form.Select {
  getTemplate() {
    return selectGroupTemplate
  }
}

function conditionalRenderRow(row, locals) {
  let buttonRow = ''
  if (locals.config.allAvailableGroups.indexOf(row.input.props.value) != -1) {
    buttonRow = <div className="col-sm-4 col-xs-6">{list.renderButtonGroup(row.buttons, locals)}</div>
  }

  return (
    <div key={row.key} className="ui grid">
      <div className="col-sm-8 col-xs-6">{row.input}</div>
      {buttonRow}
    </div>
  )
}

/**
 * Custom list for conditional removals
 */
const list = t.form.Form.templates.list.clone({
  renderRow: conditionalRenderRow,
})

export default class GroupAssignmentDialog extends Component {
  static propTypes = {
    saveMethod: PropTypes.func.isRequired,
    closeMethod: PropTypes.func.isRequired,
    selectedItem: PropTypes.object,
    dialect: PropTypes.object,
    ref: PropTypes.string,
    title: PropTypes.string,
    fieldMapping: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false,
    }

    this.isUserRegistration = false
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  componentWillReceiveProps(nextProps) {
    this.isUserRegistration = selectn('type', nextProps.selectedItem) === 'FVUserRegistration'
  }

  _onRequestSaveForm(e) {
    e.preventDefault()

    // tcomb validation not required, will not work with groups
    const formValue = this.refs.form_group_assignment.getValue()
    const properties = {}

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key) {
        if (formValue[key] && formValue[key] != '') {
          properties[key] = formValue[key]
        }
      }
    }

    // Passed validation
    if (formValue) {
      this.props.saveMethod(properties, this.props.selectedItem)
      this.props.closeMethod()
    }
  }

  render() {
    const currentlyAssignedGroups = selectn(this.props.fieldMapping.groups, this.props.selectedItem) || []
    const currentlyAssignedGroupsLabels = currentlyAssignedGroups.map((group) => {
      return (
        <span className={classNames('label', 'label-default')} style={{ marginRight: '5px' }}>
          {StringHelpers.toTitleCase(group.replace(/_/g, ' '))}
        </span>
      )
    })

    const dialectGroups = ProviderHelpers.getDialectGroups(
      selectn('response.contextParameters.acls[0].aces', this.props.dialect),
      currentlyAssignedGroups
    )

    const formSchema = t.struct({
      id: t.String,
      group: dialectGroups.new
        ? !this.isUserRegistration
          ? t.list(t.enums(dialectGroups.new))
          : t.enums(dialectGroups.new)
        : t.String, //,
      //'comment': t.maybe(t.String)
    })

    const formOptions = {
      fields: {
        id: {
          type: 'hidden',
        },
        group: {
          label: this.isUserRegistration
            ? intl.trans('views.pages.users.group.group_to_add_user_to', 'Group to add user to', 'first') + ':'
            : intl.trans('groups', 'Groups', 'first') + ':',
          // help: (this.isUserRegistration) ? intl.trans('views.pages.users.group.only_one_per_user', 'Note: Only one group per user (for each dialect) is required due to permission inheritance.', 'first')
          //     : intl.trans('views.pages.users.group.group_permissions', 'Note: Groups with more permissions will inherit permissions from groups with less permissions. Example: \'Recorders with Approval\' get permissions that both \'Recorders\' and a \'Members\' have.)'),
          disableOrder: true,
          item: {
            factory: SelectGroupFactory,
          },
          config: {
            allAvailableGroups: dialectGroups.all ? Object.keys(dialectGroups.all) : null,
            newAvailableGroups: dialectGroups.new ? Object.keys(dialectGroups.new) : null,
          },
          template: this.isUserRegistration ? null : list,
        }, //,
        // 'comment': {
        //     label: intl.trans('views.pages.users.group.comment_optional', 'Comment (Optional)'),
        //     help: intl.trans('views.pages.users.group.comment_attached', 'Note: Your comment will be attached to the welcome email sent to the user.'),
        //     type: (this.isUserRegistration) ? 'textarea' : 'hidden'
        // }
      },
    }

    return (
      <Dialog
        open={this.props.open}
        actions={[
          <Button secondary onClick={this.props.closeMethod}>
            {intl.trans('cancel', 'Cancel', 'first')}
          </Button>,
          <Button primary keyboardFocused onClick={this._onRequestSaveForm}>
            {intl.trans('submit', 'Submit', 'first')}
          </Button>,
        ]}
        onRequestClose={this.props.closeMethod}
        autoScrollBodyContent
      >
        <h1>
          {selectn('properties.userinfo:firstName', this.props.selectedItem)}
          &nbsp;
          {selectn('properties.userinfo:lastName', this.props.selectedItem)}: {this.props.title}
        </h1>

        <form onSubmit={this._onRequestSaveForm}>
          <t.form.Form
            ref="form_group_assignment"
            value={{
              id: selectn(this.props.fieldMapping.id, this.props.selectedItem),
              group: currentlyAssignedGroups,
            }}
            type={formSchema}
            options={formOptions}
          />
        </form>
      </Dialog>
    )
  }
}

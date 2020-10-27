import React from 'react'
import t from 'tcomb-form'

import DirectoryList from 'components/DirectoryList'
import QueryList from 'components/QueryList'
import DialectList from 'components/DialectList'
// import IntlService from 'common/services/IntlService'
// const intl = IntlService.instance

function renderInput(locals) {
  const onChange = function onChange(value) {
    locals.onChange(value)
  }

  let list

  // Render directory list
  if (locals.attrs.directory) {
    list = (
      <DirectoryList
        label={locals.label}
        value={locals.value || locals.attrs.defaultValue}
        onChange={onChange}
        fancy={locals.attrs.fancy}
        placeholder={locals.attrs.placeholder}
        dir={locals.attrs.directory}
        dataTestId={locals.attrs.name}
      />
    )
  }

  // Render query list
  if (locals.attrs.query) {
    list = (
      <QueryList
        label={locals.attrs.label}
        value={locals.value || locals.attrs.defaultValue}
        onChange={onChange}
        fancy={locals.attrs.fancy}
        query={locals.attrs.query}
        queryId={locals.attrs.queryId}
      />
    )
  }

  // Render dialect list
  if (locals.attrs.query === 'dialect_list') {
    list = (
      <DialectList
        label={locals.attrs.label}
        value={locals.value || locals.attrs.defaultValue}
        onChange={onChange}
        fancy={locals.attrs.fancy}
        query={locals.attrs.query}
        queryId={locals.attrs.queryId}
      />
    )
  }

  return <div>{list}</div>
}

const selectTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class SelectFactory extends t.form.Textbox {
  getTemplate() {
    return selectTemplate
  }
}

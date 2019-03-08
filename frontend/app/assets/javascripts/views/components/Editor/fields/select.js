import React, { Component, PropTypes } from "react"
import t from "tcomb-form"

import DirectoryList from "views/components/Editor/DirectoryList"
import QueryList from "views/components/Editor/QueryList"
import DialectList from "views/components/Editor/DialectList"
import IntlService from "views/services/intl"

const intl = IntlService.instance

function renderInput(locals) {
  const onChange = function(value) {
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
        directory={locals.attrs.directory}
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
  if (locals.attrs.query == "dialect_list") {
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

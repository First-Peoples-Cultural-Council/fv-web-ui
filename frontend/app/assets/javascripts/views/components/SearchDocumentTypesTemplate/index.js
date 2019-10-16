import React from 'react'
import IntlService from 'views/services/intl'
const intl = IntlService.instance
import '!style-loader!css-loader!./SearchDocumentTypesTemplate.css'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import Tooltip from '@material-ui/core/Tooltip'
export const SearchDocumentTypesTemplate = (locals) => {
  return (
    <div className="SearchDocumentTypesTemplate row">
      <fieldset>
        <legend>
          {locals.label}{' '}
          {locals.items.length < 4 ? (
            <button type="button" className="FlatButton" onClick={locals.add.click}>
              {locals.add.label}
            </button>
          ) : null}
        </legend>
        {(locals.items || []).map((item, i) => {
          return (
            <div className="SearchDocumentTypesTemplate__DocumentTypesGroup" key={i}>
              <div className="SearchDocumentTypesTemplate__inputContainer">{item.input}</div>
              {item.buttons.map((button, j) => {
                if (button.type == 'remove') {
                  return (
                    <Tooltip
                      key={`Tooltip__${j}`}
                      title={intl.translate({
                        key: 'remove_item',
                        default: 'Remove Item',
                        case: 'words',
                      })}
                    >
                      <IconButton key={`IconButton__${j}`} onClick={button.click}>
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  )
                }
              })}
            </div>
          )
        })}
      </fieldset>
    </div>
  )
}

export default SearchDocumentTypesTemplate

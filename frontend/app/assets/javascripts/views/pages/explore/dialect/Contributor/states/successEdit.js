import React from 'react'
import PropTypes from 'prop-types'
const { string, object, func } = PropTypes
export class ContributorStateSuccessEdit extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    formData: object,
    handleClick: func,
  }
  static defaultProps = {
    className: 'FormRecorder',
    copy: {
      edit: {},
    },
  }
  render() {
    const { className, copy, formData, handleClick } = this.props

    const name = formData['dc:title']
    const description = formData['dc:description']
    return (
      <div className={`${className} Contributor Contributor--successEdit`}>
        <h1>{copy.edit.success.title}</h1>
        <p>{copy.edit.success.review}</p>
        <dl>
          <dt>{name || copy.edit.success.noName}</dt>
          {/* <dd>{description || ''}</dd> */}
          <dd dangerouslySetInnerHTML={{ __html: description || '' }} />
        </dl>
        <p>{copy.edit.success.thanks}</p>
        <a
          href={window.location.pathname}
          onClick={(e) => {
            e.preventDefault()
            handleClick()
          }}
        >
          {copy.edit.success.linkCreateAnother}
        </a>
      </div>
    )
  }
}

export default ContributorStateSuccessEdit

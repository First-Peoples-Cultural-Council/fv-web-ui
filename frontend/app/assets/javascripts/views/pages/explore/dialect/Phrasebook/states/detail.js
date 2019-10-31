import React from 'react'
import PropTypes from 'prop-types'

const { bool, string, element, object } = PropTypes
export class PhrasebookStateDetail extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    breadcrumb: element,
    isTrashed: bool,
    valueName: string,
    valueDescription: string,
  }
  static defaultProps = {
    className: '',
    breadcrumb: null,
    isTrashed: false,
    valueName: '',
    valueDescription: '',
    copy: {
      default: {},
    },
  }
  render() {
    const { className, copy, isTrashed, valueName, valueDescription, breadcrumb } = this.props
    const _copy = copy.detail
    const itemDeleted = isTrashed ? <div className="alert alert-danger">{_copy.isTrashed}</div> : null
    return (
      <div className={`${className} Phrasebook Phrasebook--detail`}>
        <div className="Phrasebook__content">
          <div className="Phrasebook__main">
            <div className="Phrasebook__mainInner">
              {itemDeleted}
              <header>
                {breadcrumb}
                <h1 className="Phrasebook__heading">{_copy.title}</h1>
              </header>
              {/* Name ------------- */}
              <h2 className="visually-hidden">{_copy.name}</h2>
              <p className="Phrasebook__name">{valueName}</p>

              {/* Description ------------- */}
              <h2 className="visually-hidden">{_copy.biography}</h2>
              <div className="Phrasebook__description" dangerouslySetInnerHTML={{ __html: valueDescription }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PhrasebookStateDetail

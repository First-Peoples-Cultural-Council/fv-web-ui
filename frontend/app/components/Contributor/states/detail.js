import React from 'react'
import PropTypes from 'prop-types'
import Image from 'components/Image'
const { bool, string, element, object } = PropTypes
export class ContributorStateDetail extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    breadcrumb: element,
    isTrashed: bool,
    valueName: string,
    valueDescription: string,
    valuePhotoName: string,
    valuePhotoData: string,
  }
  static defaultProps = {
    className: '',
    breadcrumb: null,
    isTrashed: false,
    valueName: '',
    valueDescription: '',
    valuePhotoName: '',
    valuePhotoData: '',
    copy: {
      default: {},
    },
  }
  render() {
    const {
      className,
      copy,
      isTrashed,
      valueName,
      valueDescription,
      valuePhotoName,
      valuePhotoData,
      breadcrumb,
    } = this.props
    const _copy = copy.detail

    const itemDeleted = isTrashed ? <div className="alert alert-danger">{_copy.isTrashed}</div> : null
    return (
      <div className={`${className} Contributor Contributor--detail`}>
        <div className="Contributor__content">
          <div className="Contributor__main">
            <div className="Contributor__mainInner">
              {itemDeleted}

              <header>
                {breadcrumb}
                <h1 className="Contributor__heading">{_copy.title}</h1>
              </header>

              {/* Name ------------- */}
              <h2 className="visually-hidden">{_copy.name}</h2>
              <p className="Contributor__name">{valueName}</p>

              {/* Biography/Description ------------- */}
              <h2 className="visually-hidden">{_copy.biography}</h2>
              <div className="Contributor__description" dangerouslySetInnerHTML={{ __html: valueDescription }} />
            </div>
          </div>

          {/* File --------------- */}
          {valuePhotoData && (
            <div className="Contributor__graphic">
              <div className="Contributor__graphicInner">
                <h2 className="visually-hidden">{_copy.profilePhoto}</h2>
                <Image className="Contributor__photo" src={valuePhotoData} alt={`Photo representing '${valueName}'`} />
                <p className="Contributor__photoFilename visually-hidden">{valuePhotoName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default ContributorStateDetail

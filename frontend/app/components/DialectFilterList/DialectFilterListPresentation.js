import React from 'react'
import PropTypes from 'prop-types'
import Link from 'components/Link'
import './DialectFilterList.css'
function DialectFilterListPresentation({ title, listItemData }) {
  const generateList = () => {
    const listItems = listItemData.map((parent, parentIndex) => {
      const {
        isActive: parentIsActive,
        hasActiveChild: parentHasActiveChild,
        uid: parentUid,
        text: parentText,
        href: parentHref,
      } = parent
      const parentActiveClass = parentIsActive ? 'DialectFilterListLink--active' : ''

      const childrenNodes =
        parent.children.length > 0
          ? parent.children.map((child, childIndex) => {
              const { isActive: childIsActive, uid: childUid, text: childText, href: childHref } = child

              let childActiveClass = ''
              if (parentActiveClass) {
                childActiveClass = 'DialectFilterListLink--activeParent'
              }
              if (childIsActive) {
                childActiveClass = 'DialectFilterListLink--active'
              }
              return (
                <li key={childUid}>
                  <Link
                    dataTestId={`DialectFilterListItem-${parentIndex}-${childIndex}`}
                    className={`DialectFilterListLink DialectFilterListLink--child ${childActiveClass}`}
                    href={childHref}
                    title={childText}
                  >
                    {childText}
                  </Link>
                </li>
              )
            })
          : null

      const parentActiveChildClass = parentHasActiveChild ? 'DialectFilterListLink--activeChild' : ''
      return (
        <li key={parentUid} className={`DialectFilterListItemParent ${parentActiveClass} ${parentActiveChildClass}`}>
          <div className="DialectFilterListItemGroup">
            <Link
              dataTestId={`DialectFilterListItem-${parentIndex}`}
              className={`DialectFilterListLink DialectFilterListLink--parent ${parentActiveClass}`}
              href={parentHref}
              title={parentText}
            >
              {parentText}
            </Link>
          </div>
          {childrenNodes && <ul className="DialectFilterListList">{childrenNodes}</ul>}
        </li>
      )
    })

    return listItems ? <ul className="DialectFilterListList DialectFilterListList--root">{listItems}</ul> : null
  }

  return (
    <div className="DialectFilterList" data-testid="DialectFilterList">
      <h2>{title}</h2>
      {listItemData.length !== 0 && generateList()}
    </div>
  )
}

// Proptypes
const { array, string } = PropTypes
DialectFilterListPresentation.propTypes = {
  title: string.isRequired,
  listItemData: array,
}

DialectFilterListPresentation.defaultProps = {
  listItemData: [],
}

export default DialectFilterListPresentation

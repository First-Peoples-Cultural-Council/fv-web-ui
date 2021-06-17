import React from 'react'
import ExploreLanguagesPresentation from 'components/ExploreLanguages/ExploreLanguagesPresentation'
import ExploreLanguagesData from 'components/ExploreLanguages/ExploreLanguagesData'

/**
 * @summary ExploreLanguagesContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ExploreLanguagesContainer() {
  return (
    <ExploreLanguagesData>
      {({ isKids, isLoggedIn, isWorkspaces, portalListProps }) => {
        return (
          <ExploreLanguagesPresentation
            isKids={isKids}
            isLoggedIn={isLoggedIn}
            isWorkspaces={isWorkspaces}
            portalListProps={portalListProps}
          />
        )
      }}
    </ExploreLanguagesData>
  )
}

export default ExploreLanguagesContainer

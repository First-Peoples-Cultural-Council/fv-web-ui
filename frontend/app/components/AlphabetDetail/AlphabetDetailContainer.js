import React from 'react'
import AlphabetDetailPresentation from 'components/AlphabetDetail/AlphabetDetailPresentation'
import AlphabetDetailData from 'components/AlphabetDetail/AlphabetDetailData'

/**
 * @summary AlphabetDetailContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetDetailContainer() {
  return (
    <AlphabetDetailData>
      {({
        character,
        relatedVideos,
        computedCharacter,
        computedDialect2,
        computeEntities,
        computeLogin,
        currentAppliedFilter,
        intl,
        onNavigateRequest,
        publishChangesAction,
        relatedWords,
        routeParams,
        relatedAudio,
        shouldRenderPageToolbar,
        tabsOnChange,
        tabValue,
      }) => {
        return (
          <AlphabetDetailPresentation
            character={character}
            relatedVideos={relatedVideos}
            computedCharacter={computedCharacter}
            computedDialect2={computedDialect2}
            computeEntities={computeEntities}
            computeLogin={computeLogin}
            currentAppliedFilter={currentAppliedFilter}
            intl={intl}
            onNavigateRequest={onNavigateRequest}
            publishChangesAction={publishChangesAction}
            relatedWords={relatedWords}
            shouldRenderPageToolbar={shouldRenderPageToolbar}
            tabsOnChange={tabsOnChange}
            tabValue={tabValue}
            routeParams={routeParams}
            relatedAudio={relatedAudio}
          />
        )
      }}
    </AlphabetDetailData>
  )
}

export default AlphabetDetailContainer

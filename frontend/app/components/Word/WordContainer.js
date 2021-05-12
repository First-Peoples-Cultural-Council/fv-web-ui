import React from 'react'
import PropTypes from 'prop-types'
import WordData from 'components/Word/WordData'

import DetailWordPhrase from 'components/DetailWordPhrase'
import PromiseWrapper from 'components/PromiseWrapper'
import withActions from 'components/withActions'
const DetailsViewWithActions = withActions(PromiseWrapper, true)

/**
 * @summary WordContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordContainer() {
  return (
    <WordData>
      {({
        // Actions
        computeEntities,
        computeLogin,
        computeWord,
        deleteWord,
        dialect,
        publishWord,
        routeParams,
        wordPath,
        // DetailView
        acknowledgement,
        audio,
        categories,
        culturalNotes,
        definitions,
        dialectClassName,
        docType,
        generalNote,
        literalTranslations,
        partOfSpeech,
        photos,
        phrases,
        pronunciation,
        properties,
        pushWindowPath,
        relatedAssets,
        relatedToAssets,
        siteTheme,
        splitWindowPath,
        title,
        videos,
      }) => {
        return (
          <DetailsViewWithActions
            actions={['workflow', 'edit', 'visibility', 'publish']}
            computeEntities={computeEntities}
            computeItem={computeWord}
            computeLogin={computeLogin}
            deleteAction={deleteWord}
            itemPath={wordPath}
            labels={{ single: 'word' }}
            onNavigateRequest={pushWindowPath}
            permissionEntry={dialect}
            publishAction={publishWord}
            routeParams={routeParams}
            splitWindowPath={splitWindowPath}
            tabsData={{ phrases, photos, videos, audio }}
          >
            <DetailWordPhrase.Presentation
              acknowledgement={acknowledgement}
              audio={audio}
              categories={categories}
              culturalNotes={culturalNotes}
              definitions={definitions}
              dialectClassName={dialectClassName}
              docType={docType}
              generalNote={generalNote}
              literalTranslations={literalTranslations}
              metadata={computeWord}
              partOfSpeech={partOfSpeech}
              photos={photos}
              phrases={phrases}
              pronunciation={pronunciation}
              properties={properties}
              pushWindowPath={pushWindowPath}
              relatedAssets={relatedAssets}
              relatedToAssets={relatedToAssets}
              siteTheme={siteTheme}
              title={title}
              videos={videos}
            />
          </DetailsViewWithActions>
        )
      }}
    </WordData>
  )
}

// PROPTYPES
const { string } = PropTypes
WordContainer.propTypes = {
  // Prop from v2
  wordId: string,
}

export default WordContainer

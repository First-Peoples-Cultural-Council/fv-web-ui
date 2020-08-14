import React from 'react'
// import PropTypes from 'prop-types'
// import PhrasePresentation from 'components/Phrase/PhrasePresentation'
import PhraseData from 'components/Phrase/PhraseData'

import DetailWordPhrase from 'components/DetailWordPhrase'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import withActions from 'views/hoc/view/with-actions'
const DetailsViewWithActions = withActions(PromiseWrapper, true)

/**
 * @summary PhraseContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhraseContainer() {
  return (
    <PhraseData>
      {({
        // Actions
        computeEntities,
        deleteWord,
        dialect,
        publishWord,
        tabData,
        computeWord,
        wordPath,
        // DetailView
        acknowledgement,
        audio,
        categories,
        culturalNotes,
        definitions,
        dialectClassName,
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
        title,
        videos,
      }) => {
        return (
          <DetailsViewWithActions
            labels={{ single: 'word' }}
            itemPath={wordPath}
            actions={['workflow', 'edit', 'visibility', 'publish']}
            publishAction={publishWord}
            deleteAction={deleteWord}
            onNavigateRequest={pushWindowPath}
            computeItem={computeWord}
            permissionEntry={dialect}
            tabsData={tabData}
            computeEntities={computeEntities}
          >
            <DetailWordPhrase.Presentation
              acknowledgement={acknowledgement}
              audio={audio}
              categories={categories}
              culturalNotes={culturalNotes}
              definitions={definitions}
              dialectClassName={dialectClassName}
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
    </PhraseData>
  )
}
// PROPTYPES
// const { string } = PropTypes
PhraseContainer.propTypes = {
  //   something: string,
}

export default PhraseContainer

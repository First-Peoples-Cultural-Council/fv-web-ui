import React from 'react'
import WordData from 'components/Word/WordData'

import DetailWordPhrase from 'components/DetailWordPhrase'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import withActions from 'views/hoc/view/with-actions'
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
        tabData,
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
            tabsData={tabData}
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
    </WordData>
  )
}

export default WordContainer

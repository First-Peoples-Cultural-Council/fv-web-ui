import React from 'react'
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
        computeLogin,
        computePhrase,
        deletePhrase,
        dialect,
        phrasePath,
        publishPhrase,
        routeParams,
        // DetailView
        acknowledgement,
        audio,
        culturalNotes,
        definitions,
        docType,
        dialectClassName,
        literalTranslations,
        photos,
        phrasebooks,
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
            computeItem={computePhrase}
            computeLogin={computeLogin}
            deleteAction={deletePhrase}
            itemPath={phrasePath}
            labels={{ single: 'phrase' }}
            onNavigateRequest={pushWindowPath}
            permissionEntry={dialect}
            publishAction={publishPhrase}
            routeParams={routeParams}
            splitWindowPath={splitWindowPath}
            tabsData={{ photos, videos, audio }}
          >
            <DetailWordPhrase.Presentation
              acknowledgement={acknowledgement}
              audio={audio}
              categories={phrasebooks}
              culturalNotes={culturalNotes}
              definitions={definitions}
              dialectClassName={dialectClassName}
              docType={docType}
              literalTranslations={literalTranslations}
              metadata={computePhrase}
              photos={photos}
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

export default PhraseContainer

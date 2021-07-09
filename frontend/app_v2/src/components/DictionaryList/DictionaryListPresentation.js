import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

//FPCC
import AudioMinimal from 'components/AudioMinimal'
import useIcon from 'common/useIcon'
import { makePlural } from 'common/urlHelpers'
import { getMediaUrl } from 'common/urlHelpers'
import Loading from 'components/Loading'
import ActionsMenu from 'components/ActionsMenu'
import Drawer from 'components/Drawer'
import Word from 'components/Word'
import Phrase from 'components/Phrase'

/**
 * @summary DictionaryListPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function DictionaryListPresentation({
  actions,
  infiniteScroll,
  isLoading,
  items,
  moreActions,
  onSortByClick,
  sitename,
  showType,
  sorting,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedItem, setselectedItem] = useState({})
  const { isFetchingNextPage, fetchNextPage, hasNextPage, loadButtonLabel, loadButtonRef } = infiniteScroll

  function getDrawerContents() {
    const { id, type, parentDialect } = selectedItem

    const link = type ? (
      <Link
        className="ml-2 -mt-7 w-min whitespace-nowrap bg-primary hover:bg-primary-dark font-medium px-5 py-2 rounded-lg shadow-sm text-base text-center text-white"
        to={`/${parentDialect?.shortUrl ? parentDialect.shortUrl : sitename}/${makePlural(type)}/${id}`}
      >
        Go to {type}
      </Link>
    ) : null

    switch (type) {
      case 'word':
        return (
          <>
            {link}
            <Word.Container docId={selectedItem.id} isDrawer />
          </>
        )
      case 'phrase':
        return (
          <>
            {link}
            <Phrase.Container docId={selectedItem.id} isDrawer />
          </>
        )
      default:
        return null
    }
  }

  const getIcon = (field) => {
    if (!sorting) {
      return useIcon('', 'inline-flex h-6 fill-current')
    }
    if (sorting?.sortBy === field && sorting?.sortAscending === true) {
      return useIcon('ChevronDown', 'inline-flex h-6 fill-current')
    }
    if (sorting?.sortBy === field && sorting?.sortAscending === false) {
      return useIcon('ChevronUp', 'inline-flex h-6 fill-current')
    }
    return useIcon('ChevronUpDown', 'inline-flex h-6 fill-current')
  }

  function handleItemClick(item) {
    if (item.type === 'word' || item.type === 'phrase') {
      setselectedItem(item)
      setDrawerOpen(true)
    }
    return
  }

  return (
    <Loading.Container isLoading={isLoading}>
      {items?.pages !== undefined && items?.pages?.length > 0 ? (
        <div className="flex flex-col">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow-md overflow-hidden border-b border-gray-300 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <button
                        onClick={() => onSortByClick('ENTRY')}
                        className="flex items-center text-left text-xs font-medium text-fv-charcoal-light tracking-wider"
                      >
                        <div className="inline-flex">ENTRY</div>
                        {getIcon('ENTRY')}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <button
                        onClick={() => onSortByClick('TRANSLATION')}
                        className="flex items-center text-left text-xs font-medium text-fv-charcoal-light tracking-wider"
                      >
                        <div className="inline-flex">TRANSLATION</div>
                        {getIcon('TRANSLATION')}
                      </button>
                    </th>
                    {showType && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                    )}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {items.pages.map((page, index) => (
                    <React.Fragment key={index}>
                      {page.results.map(({ id, title, translations, audio, type, parentDialect }) => (
                        <tr key={id}>
                          <td className="px-6 py-4 flex items-center">
                            <button
                              className="font-medium text-fv-charcoal mr-2"
                              onClick={() => handleItemClick({ id, type, parentDialect })}
                            >
                              {title}
                            </button>
                            {audio.length > 0
                              ? audio.map((audioId, i) => (
                                  <AudioMinimal.Container
                                    key={i}
                                    src={getMediaUrl({ id: audioId, type: 'audio' })}
                                    icons={{
                                      Play: useIcon(
                                        'Audio',
                                        'fill-current text-fv-charcoal-light hover:text-fv-charcoal m-1 h-8 w-8 md:h-6 md:w-6'
                                      ),
                                      Pause: useIcon(
                                        'PauseCircle',
                                        'fill-current text-fv-charcoal-light hover:text-fv-charcoal m-1 h-8 w-8 md:h-6 md:w-6'
                                      ),
                                      Error: useIcon(
                                        'TimesCircle',
                                        'fill-current text-fv-charcoal-light hover:text-fv-charcoal m-1 h-8 w-8 md:h-6 md:w-6'
                                      ),
                                    }}
                                  />
                                ))
                              : null}
                          </td>
                          <td className="px-6 py-4">
                            {translations ? (
                              <ol className="text-fv-charcoal">
                                {translations.map((translation, i) => (
                                  <li key={i}>
                                    {translations.length > 1 ? `${i + 1}. ` : null} {translation}
                                  </li>
                                ))}
                              </ol>
                            ) : null}
                          </td>
                          {showType && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${type} capitalize text-white`}
                              >
                                {type}
                              </span>
                            </td>
                          )}
                          <td className="text-right px-6">
                            <ActionsMenu.Container
                              docId={id}
                              docTitle={title}
                              docType={type}
                              actions={actions}
                              moreActions={moreActions}
                              withConfirmation
                              withTooltip
                            />
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={'p-3 text-center text-fv-charcoal font-semibold'}>
            <button ref={loadButtonRef} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
              {loadButtonLabel}
            </button>
          </div>
        </div>
      ) : (
        <div className="m-5 md:mx-20 md:my-10">Sorry, no results were found for this search.</div>
      )}
      <Drawer.Presentation isOpen={drawerOpen} closeHandler={() => setDrawerOpen(false)}>
        {getDrawerContents()}
      </Drawer.Presentation>
    </Loading.Container>
  )
}

// PROPTYPES
const { array, bool, func, object, string } = PropTypes
DictionaryListPresentation.propTypes = {
  actions: array,
  infiniteScroll: object,
  isLoading: bool,
  items: object,
  moreActions: array,
  onSortByClick: func,
  showType: bool,
  sitename: string,
  sorting: object,
}

DictionaryListPresentation.defaultProps = {
  actions: [],
  moreActions: [],
}

export default DictionaryListPresentation

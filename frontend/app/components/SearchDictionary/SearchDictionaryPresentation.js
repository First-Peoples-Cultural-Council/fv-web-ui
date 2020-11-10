import React from 'react'
import PropTypes from 'prop-types'

// Material-UI
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

// FPCC
import UIHelpers from 'common/UIHelpers'

import Link from 'components/Link'
import Preview from 'components/Preview'
import PromiseWrapper from 'components/PromiseWrapper'

import '!style-loader!css-loader!./SearchDictionary.css'

/**
 * @summary SearchDictionaryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDictionaryPresentation({ computeEntities, searchTerm, entries, intl }) {
  const DEFAULT_LANGUAGE = 'english'

  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      {entries.length === 0 ? (
        <div className="SearchDictionary">
          <Paper className="container">
            <h1 className="title">{searchTerm} Search Results</h1>
            <div className={'WordsList WordsList--noData'}>Sorry, no results were found for this search.</div>
          </Paper>
        </div>
      ) : (
        <div className="SearchDictionary">
          <Paper className="container">
            <h1 className="title">{searchTerm} Search Results</h1>
            <Table>
              <TableHead className="SearchDictionary__row">
                <TableRow>
                  <TableCell>{intl.trans('title', 'Title', 'first')}</TableCell>
                  <TableCell>{intl.trans('translation', 'Translation', 'first')}</TableCell>
                  <TableCell>{intl.trans('audio', 'Audio', 'first')}</TableCell>
                  <TableCell>{intl.trans('picture', 'Picture', 'first')}</TableCell>
                  <TableCell>{intl.trans('type', 'Type', 'first')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map(({ uid, title, href, translations, audio, picture, type }) => (
                  <TableRow key={uid}>
                    <TableCell component="th" scope="row">
                      <Link className="SearchDictionary__link SearchDictionary__link--indigenous" href={href}>
                        {title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {UIHelpers.generateOrderedListFromDataset({
                        dataSet: translations,
                        extractDatum: (defintion, i) => {
                          if (defintion.language === DEFAULT_LANGUAGE && i < 2) {
                            return defintion.translation
                          }
                          return null
                        },
                        classNameList: 'SearchDictionary__definitionList',
                        classNameListItem: 'SearchDictionary__definitionListItem',
                      })}
                    </TableCell>
                    <TableCell>
                      {audio ? (
                        <Preview
                          minimal
                          styles={{ padding: 0 }}
                          tagStyles={{ width: '100%', minWidth: '230px' }}
                          expandedValue={audio}
                          type="FVAudio"
                        />
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {picture ? (
                        <img
                          className="SearchDictionary__itemThumbnail PrintHide"
                          src={UIHelpers.getThumbnail(picture, 'Thumbnail')}
                          alt={title}
                        />
                      ) : null}
                    </TableCell>
                    <TableCell>{type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )}
    </PromiseWrapper>
  )
}
// PROPTYPES
const { array, object, string } = PropTypes
SearchDictionaryPresentation.propTypes = {
  computeEntities: object,
  entries: array,
  intl: object,
  searchTerm: string,
}

export default SearchDictionaryPresentation

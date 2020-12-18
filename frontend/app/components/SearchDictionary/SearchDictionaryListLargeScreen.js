import React from 'react'
import PropTypes from 'prop-types'

// Material-UI
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

// FPCC
import UIHelpers from 'common/UIHelpers'

import Link from 'components/Link'
import Preview from 'components/Preview'

import './SearchDictionary.css'

/**
 * @summary SearchDictionaryListLargeScreen
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDictionaryListLargeScreen({ intl, isDialect, items }) {
  const DEFAULT_LANGUAGE = 'english'
  return (
    <div className="SearchDictionaryListLargeScreen">
      <Table>
        <TableHead>
          <TableRow className="SearchDictionary__rowHeader">
            <TableCell>
              <div className="SearchDictionary__rowHeaderCell">{intl.trans('entry', 'Entry', 'first')}</div>
            </TableCell>
            <TableCell>
              <div className="SearchDictionary__rowHeaderCell">{intl.trans('translation', 'Translation', 'first')}</div>
            </TableCell>
            <TableCell>
              <div className="SearchDictionary__rowHeaderCell">{intl.trans('audio', 'Audio', 'first')}</div>
            </TableCell>
            <TableCell>
              <div className="SearchDictionary__rowHeaderCell">{intl.trans('picture', 'Picture', 'first')}</div>
            </TableCell>
            <TableCell>
              <div className="SearchDictionary__rowHeaderCell">{intl.trans('type', 'Type', 'first')}</div>
            </TableCell>
            {!isDialect ? (
              <TableCell>
                <div className="SearchDictionary__rowHeaderCell">
                  {intl.trans('language site', 'Language Site', 'first')}
                </div>
              </TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(({ uid, title, href, translations, audio, picture, type, dialect }, index) => (
            <TableRow
              key={uid}
              className={`SearchDictionary__row ${index % 2 ? 'SearchDictionary__row--b' : 'SearchDictionary__row--a'}`}
            >
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
                    className="SearchDictionary__pictureThumbnail PrintHide"
                    src={UIHelpers.getThumbnail(picture, 'Thumbnail')}
                    alt={title}
                  />
                ) : null}
              </TableCell>
              <TableCell>
                <div className="SearchDictionary__type">{type}</div>
              </TableCell>
              {!isDialect ? (
                <TableCell>
                  <div className="SearchDictionary__languageSite">{dialect}</div>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
// PROPTYPES
const { array, bool, object } = PropTypes
SearchDictionaryListLargeScreen.propTypes = {
  intl: object,
  isDialect: bool,
  items: array,
}

export default SearchDictionaryListLargeScreen

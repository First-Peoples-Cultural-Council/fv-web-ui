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

import '!style-loader!css-loader!./SearchDictionary.css'

/**
 * @summary SearchDictionaryListLargeScreen
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDictionaryListLargeScreen({ intl, items }) {
  const DEFAULT_LANGUAGE = 'english'
  return (
    <div className="SearchDictionaryListLargeScreen">
      <Table>
        <TableHead className="SearchDictionary__row">
          <TableRow>
            <TableCell>{intl.trans('entry', 'Entry', 'first')}</TableCell>
            <TableCell>{intl.trans('translation', 'Translation', 'first')}</TableCell>
            <TableCell>{intl.trans('audio', 'Audio', 'first')}</TableCell>
            <TableCell>{intl.trans('picture', 'Picture', 'first')}</TableCell>
            <TableCell>{intl.trans('type', 'Type', 'first')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(({ uid, title, href, translations, audio, picture, type }) => (
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
    </div>
  )
}
// PROPTYPES
const { array, object } = PropTypes
SearchDictionaryListLargeScreen.propTypes = {
  intl: object,
  items: array,
}

export default SearchDictionaryListLargeScreen

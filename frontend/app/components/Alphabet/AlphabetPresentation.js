import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import '!style-loader!css-loader!./Alphabet.css'

import PlayArrowIcon from '@material-ui/icons/PlayArrow'

import NavigationHelpers from 'common/NavigationHelpers'
import TextHeader from 'components/Typography/text-header'
import FVButton from 'components/FVButton'
import LearningSidebar from 'components/LearnBase/learning-sidebar'

/**
 * @summary AlphabetPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetPresentation({
  characters,
  currentChar,
  dialect,
  dialectName,
  intl,
  isSections,
  onCharacterClick,
  onCharacterLinkClick,
  properties,
}) {
  return (
    <div className="Alphabet">
      <div className={classNames('row', 'dialect-body-container')} style={{ marginTop: '15px' }}>
        <div className={classNames('col-xs-12', 'col-md-7')}>
          <div className="fontBCSans">
            <TextHeader
              title={intl.trans(
                'views.pages.explore.dialect.learn.alphabet.x_alphabet',
                dialectName + ' Alphabet',
                null,
                [dialectName]
              )}
              tag="h1"
              properties={properties}
              appendToTitle={
                <a className="PrintHide" href="alphabet/print" target="_blank">
                  <i className="material-icons">print</i>
                </a>
              }
            />
          </div>

          {currentChar.uid ? (
            <FVButton
              className="fontBCSans"
              variant="contained"
              color="primary"
              onClick={() => onCharacterLinkClick()}
              style={{
                minWidth: 'inherit',
                textTransform: 'initial',
                margin: '10px 0',
              }}
            >
              {'View Words and Phrases that start with ' + currentChar.title}
            </FVButton>
          ) : null}

          {characters && characters.length > 0 ? (
            <div style={{ marginBottom: '20px' }}>
              {characters.map((char) => {
                return (
                  <FVButton
                    key={char.uid}
                    variant="text"
                    onClick={() => onCharacterClick(char)}
                    className="alphabet__character"
                  >
                    <span className="fontBCSans">{char.title}</span>
                    {char.audio && (
                      <div className="alphabet__character--audio">
                        <PlayArrowIcon className="material-icons" />
                        <audio id={'charAudio' + char.uid} src={NavigationHelpers.getBaseURL() + char.audio} />
                      </div>
                    )}
                  </FVButton>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>
          <LearningSidebar isSection={isSections} properties={properties} dialect={dialect} />
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
const { array, bool, func, object, string } = PropTypes
AlphabetPresentation.propTypes = {
  characters: array,
  currentChar: object,
  dialect: object,
  dialectName: string,
  intl: object,
  isSections: bool,
  onCharacterClick: func,
  onCharacterLinkClick: func,
  properties: object,
}

export default AlphabetPresentation

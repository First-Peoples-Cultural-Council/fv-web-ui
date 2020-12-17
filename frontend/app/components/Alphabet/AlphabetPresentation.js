import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import '!style-loader!css-loader!./Alphabet.css'

import TextHeader from 'components/Typography/text-header'
import FVButton from 'components/FVButton'
import AudioMinimal from 'components/AudioMinimal'

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
  dialectName,
  intl,
  onCharacterClick,
  onCharacterLinkClick,
  properties,
}) {
  return (
    <div className="Alphabet">
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
                  {char.audioPath && (
                    <div className="alphabet__character--audio">
                      <AudioMinimal.Container
                        src={char.audioPath}
                        color="primary"
                        onPlayCallback={() => onCharacterClick(char)}
                      />
                    </div>
                  )}
                </FVButton>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
// PROPTYPES
const { array, func, object, string } = PropTypes
AlphabetPresentation.propTypes = {
  characters: array,
  currentChar: object,
  dialectName: string,
  intl: object,
  onCharacterClick: func,
  onCharacterLinkClick: func,
  properties: object,
}

export default AlphabetPresentation

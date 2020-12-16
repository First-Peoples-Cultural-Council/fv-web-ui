import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import '!style-loader!css-loader!./Alphabet.css'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

import FVLabel from 'components/FVLabel'

/**
 * @summary AlphabetPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} dialectName
 * @param {object} characters character data passed from AlphabetData
 *
 * @returns {node} jsx markup
 */
function AlphabetPrintPresentation({ characters, dialectName }) {
  return (
    <div className="Alphabet">
      <div className="row">
        <div className={classNames('col-xs-8', 'col-xs-offset-2')}>
          <h1>
            <FVLabel
              transKey="views.pages.explore.dialect.learn.alphabet.x_alphabet"
              defaultStr={dialectName + ' Alphabet'}
              params={[dialectName]}
            />
          </h1>
          {characters && characters.length > 0 ? (
            <div style={{ marginBottom: '20px' }}>
              <GridList cols={4} id="AlphabetGrid">
                {characters.map((char) => {
                  return (
                    <GridListTile
                      key={char.uid}
                      style={{
                        margin: '2px',
                        border: '3px solid #e0e0e0',
                        borderRadius: '5px',
                        textAlign: 'center',
                        paddingTop: '15px',
                        width: '20%',
                        height: '164px',
                      }}
                    >
                      <span style={{ fontSize: '2em' }}>
                        {char.upperCase} {char.title}
                      </span>
                      <br />
                      <br />
                      <strong style={{ fontSize: '1.3em' }}>{char.relatedWord}</strong>
                      <br />
                      <>{char.relatedDefinition}</>
                    </GridListTile>
                  )
                })}
              </GridList>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// PROPTYPES
const { array, string } = PropTypes
AlphabetPrintPresentation.propTypes = {
  characters: array,
  dialectName: string,
}

export default AlphabetPrintPresentation

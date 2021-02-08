import React, { useState, useEffect } from 'react'
import selectn from 'selectn'
import proptypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import { PlayArrow, Edit, Add, Close } from '@material-ui/icons'
import { setEditingLabel } from 'reducers/locale'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import DocumentOperations from 'operations/DocumentOperations'
import { WORKSPACES } from 'common/Constants'
import AuthorizationFilter from 'components/AuthorizationFilter/index'
import './FVLabel.css'

function FVLabel({
  transKey,
  locale,
  defaultStr,
  transform,
  params,
  prepend,
  append,
  forceLocale,
  intl,
  isInHelpMode,
  labelIds,
  startEditingLabel,
  computeDialect2,
  computeDirectory,
  routeParams,
}) {
  const [anchorElement, setAnchorElement] = useState()
  const [audioPath, setAudioPath] = useState('')
  const [isFetching, setisFetching] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const actualDialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)

  const [translation, usedFallback, actualTransKey] = intl.fvLabelTrans(
    transKey,
    defaultStr,
    transform,
    params,
    prepend,
    append,
    forceLocale
  )
  const isAdmin = (selectn('response.contextParameters.permissions', actualDialect) || []).includes('Write')

  useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  const playAudio = (pathToAudio) => {
    new Audio(NavigationHelpers.getBaseURL() + pathToAudio).play()
  }

  const handleClick = (event) => {
    if (isInHelpMode) {
      event.preventDefault()
      event.stopPropagation()
      if (anchorElement) {
        setAnchorElement(undefined)
      } else {
        const translationId = selectn(actualTransKey, labelIds)
        setAnchorElement(event.currentTarget)
        if (translationId) {
          setisFetching(true)
          DocumentOperations.getDocument(translationId, 'FVLabel', {
            headers: {
              'enrichers.document': 'label',
            },
          }).then((data) => {
            if (isMounted) {
              setAudioPath(selectn('contextParameters.label.related_audio[0].path', data))
              setisFetching(false)
            }
          })
        }
      }
    }
  }

  const handleClose = () => {
    setAnchorElement(undefined)
  }

  const openEdit = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorElement(undefined)
    startEditingLabel(actualTransKey)
  }

  const defaultLabel = <span className="fv-label">{translation}</span>

  if (isInHelpMode && (!usedFallback || isAdmin)) {
    // Only enable helper mode for available FVLabel objects
    const allLabels = selectn('directoryEntries.fv_labels', computeDirectory) || []

    const mappedLabel = allLabels.find((l) => {
      return l.value === transKey
    })

    if (!mappedLabel) {
      return defaultLabel
    }

    const translatedLabel = intl.trans(transKey, defaultStr, transform, params, prepend, append, locale)
    const isTranslated = translatedLabel != translation

    let editMenu = ''

    if (routeParams.area === WORKSPACES) {
      // Menu for editing users
      editMenu = (
        <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', actualDialect) }}>
          <ListItem button onClick={openEdit}>
            {isTranslated && (
              <div>
                <Edit className="fv-label-icon FlatButton__icon" />
                <span className="fv-label-immersion-menu">Edit translation</span>
              </div>
            )}
            {!isTranslated && (
              <div>
                <Add className="fv-label-icon FlatButton__icon" />
                <span className="fv-label-immersion-menu">Add translation</span>
              </div>
            )}
          </ListItem>
        </AuthorizationFilter>
      )
    }

    // Helper mode activated
    return (
      <span onClick={handleClick} className="fv-label fv-label-click-cover">
        {translation}
        <Menu
          id="simple-menu"
          anchorEl={anchorElement}
          open={!!anchorElement}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <ListItem className="fv-label-translation-li" disabled autoFocus={false}>
            <span className="fv-label-english-sm">ENG</span>
            <span className="fv-label-immersion-menu">{translatedLabel}</span>
          </ListItem>
          {!isFetching && audioPath && (
            <ListItem button onClick={() => playAudio(audioPath)}>
              <PlayArrow className="fv-label-icon FlatButton__icon" />
              <span className="fv-label-immersion-menu">Listen to {translation}</span>
            </ListItem>
          )}
          {editMenu}
          <ListItem button onClick={handleClose}>
            <Close className="fv-label-icon FlatButton__icon" />
            <span className="fv-label-immersion-menu">Close</span>
          </ListItem>
        </Menu>
      </span>
    )
  }
  return defaultLabel
}

const { string, array, object, bool, func } = proptypes

FVLabel.propTypes = {
  transKey: string.isRequired,
  defaultStr: string,
  transform: string,
  params: array,
  prepend: string,
  append: string,
  forceLocale: string,
  locale: string,
  intl: object.isRequired,
  isInHelpMode: bool.isRequired,
  labelIds: object.isRequired,
  computeDialect2: object.isRequired,
  computeDirectory: object.isRequired,
  startEditingLabel: func.isRequired,
  routeParams: object.isRequired,
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale, fvDialect, navigation, directory } = state
  const { computeDialect2 } = fvDialect
  const { route } = navigation

  return {
    intl: locale.intlService,
    locale: locale.locale,
    isInHelpMode: locale.isInHelpMode,
    labelIds: locale.labelIds,
    computeDialect2,
    computeDirectory: directory.computeDirectory,
    routeParams: route.routeParams,
  }
}

const mapDispatchToProps = {
  startEditingLabel: setEditingLabel,
}

export default connect(mapStateToProps, mapDispatchToProps)(FVLabel)

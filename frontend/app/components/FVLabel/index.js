import React, { useState, useEffect } from 'react'
import selectn from 'selectn'
import proptypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import { setEditingLabel } from 'reducers/locale'

import DocumentOperations from 'operations/DocumentOperations'
import Preview from 'components/Preview'
import ProviderHelpers from 'common/ProviderHelpers'
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
  routeParams,
}) {
  const [anchorElement, setAnchorElement] = useState()
  const [audioId, setAudioId] = useState('')
  const [isFetching, setisFetching] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const readableLocale = {
    en: 'English',
    fr: 'Français',
  }
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
              'enrichers.document': 'ancestry,word,permissions',
            },
          }).then((data) => {
            if (isMounted) {
              if (Object.prototype.hasOwnProperty.call(data, 'fvproxy:proxied_audio')) {
                setAudioId(selectn('properties.fvproxy:proxied_audio[0]', data))
              } else {
                setAudioId(selectn('properties.fv:related_audio[0]', data))
              }
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
    startEditingLabel(actualTransKey)
  }

  const audioContainerStyles = {
    minWidth: '200px',
    minHeight: '79px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  }

  if (isInHelpMode && (!usedFallback || isAdmin)) {
    // Helper mode activated
    return (
      <span onClick={handleClick} className="fv-label fv-label-click-cover">
        {translation}

        <Menu
          id="simple-menu"
          anchorEl={anchorElement}
          open={!!anchorElement}
          onClose={handleClose}
          onBlur={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <ListItem>
            <div>
              <Typography variant="caption">{readableLocale[locale]}:</Typography>
              <Typography variant="body2">
                {intl.trans(transKey, defaultStr, transform, params, prepend, append, locale)}
              </Typography>
            </div>
          </ListItem>
          {!isFetching && !audioId && <ListItem disabled>No Audio</ListItem>}
          {!isFetching && audioId && (
            <ListItem>
              <div style={audioContainerStyles}>
                <Preview id={audioId} type="FVAudio" minimal styles={{ flex: 1 }} />
              </div>
            </ListItem>
          )}
          {isFetching && (
            <ListItem disabled>
              <div style={audioContainerStyles} />
            </ListItem>
          )}
          {routeParams.area === WORKSPACES && (
            <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', actualDialect) }}>
              <ListItem button onClick={openEdit}>
                Edit Translation
              </ListItem>
            </AuthorizationFilter>
          )}
        </Menu>
      </span>
    )
  }
  return <span className="fv-label">{translation}</span>
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
  startEditingLabel: func.isRequired,
  routeParams: object.isRequired,
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale, fvDialect, navigation } = state
  const { computeDialect2 } = fvDialect
  const { route } = navigation

  return {
    intl: locale.intlService,
    locale: locale.locale,
    isInHelpMode: locale.isInHelpMode,
    labelIds: locale.labelIds,
    computeDialect2,
    routeParams: route.routeParams,
  }
}

const mapDispatchToProps = {
  startEditingLabel: setEditingLabel,
}

export default connect(mapStateToProps, mapDispatchToProps)(FVLabel)

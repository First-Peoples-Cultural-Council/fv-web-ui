import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import selectn from 'selectn'

import { Tooltip, Snackbar, IconButton } from '@material-ui/core'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import CloseIcon from '@material-ui/icons/Close'

import { toggleHelpMode, setEditingLabel } from 'providers/redux/reducers/locale'
import { fetchDirectory } from 'providers/redux/reducers/directory'
import DocumentOperations from 'operations/DocumentOperations'

import LabelModal from 'views/pages/explore/dialect/immersion/Modal'
import FVButton from './../FVButton/index'
import '!style-loader!css-loader!./HelperModeToggle.css'

const HelperModeToggle = ({
  handleToggleHelpMode,
  isInHelpMode,
  isImmersionModeOn,
  editingLabel,
  labelIds,
  computeDirectory,
  fetchDirectory,
  intl,
  locale,
  routeParams,
  setEditingLabel,
}) => {
  const [isNew, setIsNew] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [label, setLabel] = useState()
  const [fetched, setFetched] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    if (!fetched) {
      fetchDirectory('fv_labels', 2000, true)
      fetchDirectory('fv_label_categories', 100, true)
      setFetched(true)
    }
    if (editingLabel) {
      const uid = selectn(editingLabel, labelIds)
      setIsNew(!uid)
      const allLabels = selectn('directoryEntries.fv_labels', computeDirectory) || []
      const allCategories = selectn('directoryEntries.fv_label_categories', computeDirectory) || []

      const mappedLabel = allLabels.find((l) => {
        return l.id === editingLabel
      })
      const category = mappedLabel
        ? allCategories.find((c) => {
            return c.id === mappedLabel.category
          })
        : null
      const templateStrings = mappedLabel ? mappedLabel.template_strings.split(',') : []
      const label = {
        labelKey: editingLabel,
        type: mappedLabel ? mappedLabel.type : 'phrase',
        templateStrings,
        category: category ? category.label : 'Unknown',
        base: intl.trans(editingLabel, 'Translated Label', null, templateStrings, null, null, locale),
        translation: undefined,
        uid,
        relatedAudio: undefined,
        state: 'N/A',
      }
      if (uid) {
        DocumentOperations.getDocument(uid, 'FVLabel').then((data) => {
          label.relatedAudio = selectn('properties.fv:related_audio[0]', data)
          label.translation = selectn('properties.dc:title', data)
          label.state = selectn('state', data)
          setLabel(label)
          setIsOpen(true)
        })
      } else {
        setLabel(label)
        setIsOpen(true)
      }
    } else {
      setIsOpen(false)
    }
    return () => {
      setFetched(false)
    }
  }, [editingLabel])

  useEffect(() => {
    if (isInHelpMode) {
      setSnackbarOpen(true)
    } else {
      setSnackbarOpen(false)
    }
  }, [isInHelpMode])

  const closeModal = () => {
    setLabel(null)
    setIsOpen(false)
    setEditingLabel()
  }

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <div className="helper-mode-toggle">
      {isImmersionModeOn && (
        <>
          <Tooltip title={isInHelpMode ? 'Close Helper' : 'Turn on Helper then click labels to translate'}>
            <FVButton variant="extendedFab" color="primary" onClick={handleToggleHelpMode}>
              {!isInHelpMode && (
                <>
                  <LiveHelpIcon />
                  Enable Helper Mode
                </>
              )}
              {isInHelpMode && (
                <>
                  Close Helper Mode
                  <CloseIcon />
                </>
              )}
            </FVButton>
          </Tooltip>
          <LabelModal
            isNew={isNew}
            dialectPath={routeParams.dialect_path}
            open={isOpen}
            handleClose={(save) => closeModal(save)}
            label={label}
          />
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={closeSnackbar}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Click on labels to see their translation and audio.</span>}
            action={[
              <IconButton key="close" aria-label="Close" color="inherit" onClick={closeSnackbar}>
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  const { locale, directory, navigation } = state
  const { isInHelpMode, editingLabel } = locale

  return {
    isInHelpMode,
    editingLabel,
    labelIds: locale.labelIds,
    intl: locale.intlService,
    locale: locale.locale,
    isImmersionModeOn: !!locale.immersionMode && !!locale.workspace,
    computeDirectory: directory.computeDirectory,
    routeParams: navigation.route.routeParams,
  }
}

const mapDispatchToProps = {
  handleToggleHelpMode: toggleHelpMode,
  fetchDirectory,
  setEditingLabel,
}

const { bool, func, string, object } = propTypes

HelperModeToggle.propTypes = {
  isInHelpMode: bool.isRequired,
  isImmersionModeOn: bool.isRequired,
  handleToggleHelpMode: func.isRequired,
  fetchDirectory: func.isRequired,
  setEditingLabel: func.isRequired,
  labelIds: object.isRequired,
  editingLabel: string,
  intl: object.isRequired,
  locale: string.isRequired,
  routeParams: object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperModeToggle)

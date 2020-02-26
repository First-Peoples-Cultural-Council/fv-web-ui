import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { toggleHelpMode } from 'providers/redux/reducers/locale'
import FVButton from './../FVButton/index'
import TranslateIcon from '@material-ui/icons/Translate'
import CloseIcon from '@material-ui/icons/Close'
import '!style-loader!css-loader!./HelperModeToggle.css'

const HelperModeToggle = ({handleToggleHelpMode, isInHelpMode}) => {
  return <div className="helper-mode-toggle">
    <FVButton variant="fab" color="primary" onClick={handleToggleHelpMode}>
      {!isInHelpMode && <TranslateIcon/>}
      {isInHelpMode && <CloseIcon/>}
    </FVButton>
  </div>
}

const mapStateToProps = (state) => {
  const { locale } = state
  const { isInHelpMode } = locale

  return {
    isInHelpMode,
  }
}

const mapDispatchToProps = {
  handleToggleHelpMode: toggleHelpMode,
}

const { bool, func } = propTypes

HelperModeToggle.propTypes = {
  isInHelpMode: bool.isRequired,
  handleToggleHelpMode: func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperModeToggle)

import React from 'react'
import '!style-loader!css-loader!./RequestChanges.css'
import FVButton from 'views/components/FVButton'
import Textarea from 'views/components/Form/Common/Textarea'
import {getError, getErrorFeedback} from 'common/FormHelpers'
import VisibilitySelect from 'components/VisibilitySelect'
import PropTypes from 'prop-types'
import FVSnackbar from "../../views/components/FVSnackbar"
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

/**
 * @summary RequestChangesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RequestChangesPresentation({
  formRef,
  onSubmit,
  errors,
  docVisibility,
  handleApprove,
  handleRequestChanges,
  handleVisibilityChange,
  handleSnackbarClose,
  computeEntities,
  snackbarStatus,
}) {
  return (
      <div className="RequestChanges">
        <form name="requestChanges" ref={formRef}>
          <div className="visibilitySelector">
            <VisibilitySelect.Container
                selectNameAndId='visibilitySelect'
                docVisibility={docVisibility}
                handleVisibilityChange={handleVisibilityChange}
                computeEntities={computeEntities}
                error={getError({errors, fieldName: 'commentField'})}
            />
          </div>
          {getErrorFeedback({errors})}
          <div className="actions">
            <FVButton
                variant="outlined"
                type="submit"
                color="secondary"
                className="FVButton"
                onClick={handleApprove}
            >
              Approve
            </FVButton>
            <FVButton
                variant="outlined"
                type="submit"
                color="secondary"
                className="FVButton"
                onClick={handleRequestChanges}

            >
              Request Changes
            </FVButton>
          </div>
          <FVSnackbar
              open={snackbarStatus}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              message="Document submitted"
              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
              action={
                <IconButton size="small" aria-label="close" color="inherit"
                            onClick={handleSnackbarClose}>
                  <CloseIcon fontSize="small"/>
                </IconButton>
              }
          />
        </form>
      </div>

  )
}

// PROPTYPES
const {string, object, bool, func} = PropTypes
RequestChangesPresentation.propTypes = {
  submitMethod: string,
  computeEntities: object,
  docId: string,
  docState: string,
  handleApprove: func,
  handleRequestChanges: func,
  handleSnackbarClose: func,
  snackbarStatus: bool,

}

RequestChangesPresentation.defaultProps = {
  docId: '',
  docState: '',
  snackbarStatus: false,
}

export default RequestChangesPresentation

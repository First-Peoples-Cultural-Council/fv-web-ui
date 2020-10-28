import { execute } from 'reducers/rest'

// GET PROGRESS
// ==============================
export const exportDialectProgress = execute('EXPORT_DIALECT_PROGRESS', 'Document.GetExportProgress', {})

// CHECK FOR EXISTING EXPORT
// ==============================
export const exportDialectGetFormattedDocument = execute(
  'EXPORT_DIALECT_GET_FORMATTED_DOCUMENT',
  'Document.GetFormattedDocument',
  {}
)

// GENERATE DOCUMENT
// ==============================
export const exportDialectFVGenerateDocumentWithFormat = execute(
  'EXPORT_DIALECT_FV_GENERATE_DOCUMENT_WITH_FORMAT',
  'Document.FVGenerateDocumentWithFormat',
  {}
)

// RESET DATA
// ==============================
export const exportDialectResetData = () => {
  return (dispatch) => {
    dispatch({
      type: 'EXPORT_DIALECT_RESET_DATA',
    })
  }
}

export const exportDialectGenericError = (dialectIdData, message) => {
  return (dispatch) => {
    dispatch({
      type: 'EXPORT_ERROR_GENERIC',
      dialectIdData,
      message,
    })
  }
}

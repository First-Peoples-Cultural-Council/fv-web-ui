import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBook as _fetchBook,
  fetchBooks as _fetchBooks,
  fetchBookEntry as _fetchBookEntry,
  fetchBookEntries as _fetchBookEntries,
  deleteBook as _deleteBook,
  publishBook as _publishBook,
} from 'reducers/fvBook'

function useBook() {
  const dispatch = useDispatch()

  const deleteBook = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _deleteBook(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchBook = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchBook(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchBooks = (pathOrId, operationParams, message, headers, properties) => {
    const dispatchObj = _fetchBooks(pathOrId, operationParams, message, headers, properties)
    dispatch(dispatchObj)
  }

  const fetchBookEntry = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchBookEntry(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const fetchBookEntries = (pathOrId, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _fetchBookEntries(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
    dispatch(dispatchObj)
  }

  const publishBook = (pathOrId, operationParams, messageStart, messageSuccess, messageError, propertiesOverride) => {
    const dispatchObj = _publishBook(
      pathOrId,
      operationParams,
      messageStart,
      messageSuccess,
      messageError,
      propertiesOverride
    )
    dispatch(dispatchObj)
  }

  return {
    computeBook: useSelector((state) => state.fvBook.computeBook),
    computeBooks: useSelector((state) => state.fvBook.computeBooks),
    computeBookEntry: useSelector((state) => state.fvBook.computeBookEntry),
    computeBookEntries: useSelector((state) => state.fvBook.computeBookEntries),
    deleteBook,
    fetchBook,
    fetchBooks,
    fetchBookEntry,
    fetchBookEntries,
    publishBook,
  }
}

export default useBook

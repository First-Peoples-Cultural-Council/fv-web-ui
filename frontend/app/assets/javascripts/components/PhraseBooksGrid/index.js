import Container from './PhraseBooksGridContainer'
import Data from './PhraseBooksGridData'
import Presentation from './PhraseBooksGridPresentation'

export default {
  Container, // Note: Container imports Data & Presentation. Could there be a risk of circular dependencies?
  Data,
  Presentation,
}

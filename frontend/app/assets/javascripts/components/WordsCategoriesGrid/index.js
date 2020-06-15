import Container from './WordsCategoriesGridContainer'
import Data from './WordsCategoriesGridData'
import Presentation from './WordsCategoriesGridPresentation'

export default {
  Container, // Note: Container imports Data & Presentation. Could there be a risk of circular dependencies?
  Data,
  Presentation,
}

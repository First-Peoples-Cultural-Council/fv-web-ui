import Container from './CategoriesGridViewContainer'
import Data from './CategoriesGridViewData'
import Presentation from './CategoriesGridViewPresentation'

export default {
  Container, // Note: Container imports Data & Presentation. Could there be a risk of circular dependencies?
  Data,
  Presentation,
}

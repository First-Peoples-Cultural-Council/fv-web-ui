import { combineReducers } from 'redux'
import { directoryReducer } from './directory'
import { documentReducer } from './document'
import { errorReducer } from './error'
import { exportDialectReducer } from './exportDialect'
import { fvAudioReducer } from './fvAudio'
import { fvBookReducer } from './fvBook'
import { fvCategoryReducer } from './fvCategory'
import { fvCharacterReducer } from './fvCharacter'
import { fvContributorReducer } from './fvContributor'
import { fvDialectReducer } from './fvDialect'
import { fvGalleryReducer } from './fvGallery'
import { fvLabelReducer } from './fvLabel'
import { fvLanguageReducer } from './fvLanguage'
import { fvLanguageFamilyReducer } from './fvLanguageFamily'
import { fvLinkReducer } from './fvLink'
import { fvPageReducer } from './fvPage'
import { fvPhraseReducer } from './fvPhrase'
import { fvPictureReducer } from './fvPicture'
import { fvPortalReducer } from './fvPortal'
import { fvResourcesReducer } from './fvResources'
import { fvUserReducer } from './fvUser'
import { fvVideoReducer } from './fvVideo'
import { fvWordReducer } from './fvWord'
import { listViewReducer } from './listView'
import { localeReducer } from './locale'
import { navigationReducer } from './navigation'
import { nuxeoReducer } from './nuxeo'
import { reportsReducer } from './reports'
// import { restReducer } from './rest' // NOTE: restReducer not consumed by components, just other reducers
import { searchReducer } from './search'
import { searchDialectReducer } from './searchDialect'
import { tasksReducer } from './tasks'
import { windowPathReducer } from './windowPath'

export default combineReducers({
  directory: directoryReducer,
  document: documentReducer,
  error: errorReducer,
  exportDialect: exportDialectReducer,
  fvAudio: fvAudioReducer,
  fvBook: fvBookReducer,
  fvCategory: fvCategoryReducer,
  fvCharacter: fvCharacterReducer,
  fvContributor: fvContributorReducer,
  fvDialect: fvDialectReducer,
  fvGallery: fvGalleryReducer,
  fvLabel: fvLabelReducer,
  fvLanguage: fvLanguageReducer,
  fvLanguageFamily: fvLanguageFamilyReducer,
  fvLink: fvLinkReducer,
  fvPage: fvPageReducer,
  fvPhrase: fvPhraseReducer,
  fvPicture: fvPictureReducer,
  fvPortal: fvPortalReducer,
  fvResources: fvResourcesReducer,
  fvUser: fvUserReducer,
  fvVideo: fvVideoReducer,
  fvWord: fvWordReducer,
  locale: localeReducer,
  listView: listViewReducer,
  navigation: navigationReducer,
  nuxeo: nuxeoReducer,
  reports: reportsReducer,
  search: searchReducer,
  searchDialect: searchDialectReducer,
  tasks: tasksReducer,
  windowPath: windowPathReducer,
})

import { provide, unshiftMiddleware, createCombinedStore, unshiftEnhancer } from 'react-redux-provide'
import page, { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH } from 'provide-page'
import createLoggerMiddleware from 'redux-logger'

import Document from './Document'
import Directory from './Directory'
import ExportDialect from './ExportDialect'
import FVLanguageFamily from './FVLanguageFamily'
import FVLanguage from './FVLanguage'
import FVDialect from './FVDialect'
import FVPortal from './FVPortal'
import FVPage from './FVPage'
import FVWord from './FVWord'
import FVPhrase from './FVPhrase'
import FVBook from './FVBook'
import FVContributor from './FVContributor'
import FVLink from './FVLink'
import FVCategory from './FVCategory'
import FVAudio from './FVAudio'
import FVPicture from './FVPicture'
import FVVideo from './FVVideo'
import FVResources from './FVResources'
import FVCharacter from './FVCharacter'
import FVGallery from './FVGallery'
import FVUser from './FVUser'

import connect from './connect'
import navigation from './navigation'
import reports from './reports'
import search from './search'
import tasks from './tasks'

const loggerMiddleware = createLoggerMiddleware()

const providers = {
  page,
  connect,
  navigation,
  Document,
  Directory,
  ExportDialect,
  FVLanguageFamily,
  FVLanguage,
  FVDialect,
  FVPortal,
  FVPage,
  FVAudio,
  FVVideo,
  FVPicture,
  FVResources,
  FVWord,
  FVPhrase,
  FVBook,
  FVCategory,
  FVContributor,
  FVLink,
  FVCharacter,
  FVGallery,
  FVUser,
  reports,
  search,
  tasks,
}

// Enable log for specific provider
//unshiftMiddleware([FVWord], loggerMiddleware);

//console.log(createCombinedStore({Editor, FVPortal}));

/*if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
  unshiftEnhancer([FVPortal], window.devToolsExtension({
    actionsBlacklist: ['@@INIT']
  }));
}*/

/**
 * These providers will be exposed to each componenet that has the @provide decorator,
 * thus exposing their actions and reducers.
 */
export default providers

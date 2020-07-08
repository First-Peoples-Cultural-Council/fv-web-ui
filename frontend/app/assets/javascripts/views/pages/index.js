/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import PageExploreDialects from './explore/archive/dialects'
import PageExploreFamily from './explore/family'
import PageExploreLanguage from './explore/language'
import PageExploreDialect from './explore/dialect'

import PageDialectLearn from './explore/dialect/learn'
import PageDialectMedia from './explore/dialect/media'
import PageDialectPlay from './explore/dialect/play'

import PageJigsawGame from './explore/dialect/play/jigsaw'
import PageWordSearch from './explore/dialect/play/wordsearch'
import PageColouringBook from './explore/dialect/play/colouringbook'
import PagePictureThis from './explore/dialect/play/picturethis'
import PageHangman from './explore/dialect/play/hangman'
import PageWordscramble from './explore/dialect/play/wordscramble'
import PageQuiz from './explore/dialect/play/quiz'
import PageConcentration from './explore/dialect/play/concentration'

import PageDialectGalleries from './explore/dialect/gallery'
import PageDialectGalleryView from './explore/dialect/gallery/view'
import PageDialectReports from './explore/dialect/reports'
import PageDialectReportsView from './explore/dialect/reports/view'
import PageDialectUsers from './explore/dialect/users'

import PageDialectLearnWords from 'components/Words/WordsContainer'
import PageDialectLearnPhrases from './explore/dialect/learn/phrases'
import PageDialectLearnStoriesAndSongs from './explore/dialect/learn/songs-stories'

import PageDialectViewMedia from './explore/dialect/media/view'
import PageDialectViewWord from './explore/dialect/learn/words/view'
import PageDialectViewPhrase from './explore/dialect/learn/phrases/view'
import PageDialectViewBook from './explore/dialect/learn/songs-stories/view'
import PageDialectViewAlphabet from './explore/dialect/learn/alphabet/'
import PageDialectViewCharacter from './explore/dialect/learn/alphabet/view'
import PageDialectLearnWordsCategories from './explore/dialect/learn/words/categories'

import PhraseBooksGrid from 'components/PhraseBooksGrid'
import WordsCategoriesGrid from 'components/WordsCategoriesGrid'
import PageDialectLearnPhrasesByPhrasebook from './explore/dialect/learn/phrases/phrasesFilteredByPhrasebook'

import PageDialectImmersionList from './explore/dialect/immersion'

import PageTest from './test.js'
import PageDebugAPI from './debug-api.js'
import PageDebugTypography from './debug-typography.js'
import PageError from './error.js'
import PageHome from './home/HomeLayout'
import PageContent from './content'
import PageIntro from './intro'
import PagePlay from './play'
import PageSearch from './search'
import PageTasks from 'components/Tasks/TasksContainer'
import PageUserTasks from './tasks/users'
import PageUsersRegister from './users/register'
import PageUsersForgotPassword from './users/forgotpassword'
import PageUsersProfile from './users/profile'

// KIDS
import KidsHome from 'components/KidsHome'
import KidsPhrasesByPhrasebook from 'components/KidsPhrasesByPhrasebook/KidsPhrasesByPhrasebookContainer'
import KidsWordsByCategory from 'components/KidsWordsByCategory/KidsWordsByCategoryContainer'

// EDIT
import PageExploreDialectEdit from './explore/dialect/ExploreDialectEdit'
import PageDialectGalleryEdit from './explore/dialect/gallery/edit'
import PageDialectEditMedia from './explore/dialect/media/edit'
import PageDialectWordEdit from './explore/dialect/learn/words/Edit'
import PageDialectPhraseEdit from './explore/dialect/learn/phrases/Edit'
import PageDialectBookEdit from './explore/dialect/learn/songs-stories/edit'
import PageDialectBookEntryEdit from './explore/dialect/learn/songs-stories/entry/edit'
import PageDialectAlphabetCharacterEdit from './explore/dialect/learn/alphabet/edit'

// CREATE
import { default as PageDialectWordsCreate } from './explore/dialect/learn/words/Create'
import { default as CreateV2 } from './explore/dialect/create/Word'
import { default as CreateAudio } from './explore/dialect/create/Audio'
import { default as PageDialectPhrasesCreate } from './explore/dialect/learn/phrases/Create'
import { default as PageDialectStoriesAndSongsCreate } from './explore/dialect/learn/songs-stories/create'
import { default as PageDialectStoriesAndSongsBookEntryCreate } from './explore/dialect/learn/songs-stories/entry/create'
import { default as PageDialectGalleryCreate } from './explore/dialect/gallery/create'

// CATEGORY
// ----------------------
import CategoryBrowse from './explore/dialect/Categories' // Browse
import { default as CategoryDetail } from './explore/dialect/Category/detail' // Detail
import { default as PageDialectCategoryCreate } from './explore/dialect/Category/createV1' // Create V1 for modal
import { default as CategoryCreate } from './explore/dialect/Category/create' // Create
import { default as CategoryEdit } from './explore/dialect/Category/edit' // Edit

// CONTRIBUTOR
// ----------------------
import ContributorBrowse from './explore/dialect/contributors' // Browse
import { default as ContributorDetail } from './explore/dialect/Contributor/detail' // Detail
import { default as ContributorCreateV1 } from './explore/dialect/Contributor/createV1' // Create V1
import { default as ContributorCreate } from './explore/dialect/Contributor/create' // Create V2
import { default as ContributorEdit } from './explore/dialect/Contributor/edit' // Edit

// PHRASEBOOK
// ----------------------
import PhrasebookBrowse from './explore/dialect/Phrasebooks' // Browse
import { default as PhrasebookDetail } from './explore/dialect/Phrasebook/detail' // Detail
import { default as PageDialectPhraseBooksCreate } from './explore/dialect/Phrasebook/createV1' // Create V1
import { default as PhrasebookCreate } from './explore/dialect/Phrasebook/create' // Create V2
import { default as PhrasebookEdit } from './explore/dialect/Phrasebook/edit' // Edit

// RECORDER
// ----------------------
import RecorderBrowse from './explore/dialect/Recorders' // Browse
import { default as RecorderDetail } from './explore/dialect/Recorder/detail' // Detail
import { default as RecorderCreate } from './explore/dialect/Recorder/create' // Create
import { default as RecorderEdit } from './explore/dialect/Recorder/edit' // Edit

// DASHBOARD
// ----------------------
import Dashboard from 'components/Dashboard'
import DashboardDetail from 'components/DashboardDetail'

// MENTOR-APPRENTICE PHOTO PROJECT
// ----------------------
import PageMAPPhotoProject from './photo-project'

export {
  PageTest,
  PageMAPPhotoProject,
  PageDebugAPI,
  PageDebugTypography,
  PageError,
  PageIntro,
  PageHome,
  PageContent,
  PageExploreDialects,
  PageExploreFamily,
  PageExploreLanguage,
  PageExploreDialect,
  PageDialectLearn,
  PageDialectMedia,
  PageDialectLearnWords,
  PageDialectLearnWordsCategories,
  PageDialectLearnPhrases,
  PageDialectLearnPhrasesByPhrasebook,
  PhraseBooksGrid,
  WordsCategoriesGrid,
  PageDialectLearnStoriesAndSongs,
  PageDialectViewWord,
  PageDialectViewMedia,
  PageDialectViewPhrase,
  PageDialectViewBook,
  PageDialectViewAlphabet,
  PageDialectViewCharacter,
  PageDialectPlay,
  PageDialectGalleries,
  PageDialectGalleryView,
  PageDialectReports,
  PageDialectReportsView,
  PageDialectUsers,
  PagePlay,
  PageSearch,
  PageTasks,
  PageUserTasks,
  PageUsersRegister,
  PageUsersForgotPassword,
  PageUsersProfile,
  PageDialectImmersionList,
  //GAMES
  PageJigsawGame,
  PageColouringBook,
  PageWordSearch,
  PagePictureThis,
  PageConcentration,
  PageHangman,
  PageWordscramble,
  PageQuiz,
  // KIDS
  KidsHome,
  KidsPhrasesByPhrasebook,
  KidsWordsByCategory,
  // EDITS
  PageExploreDialectEdit,
  PageDialectWordEdit,
  PageDialectEditMedia,
  PageDialectPhraseEdit,
  PageDialectBookEdit,
  PageDialectBookEntryEdit,
  PageDialectAlphabetCharacterEdit,
  PageDialectGalleryEdit,
  //CREATE
  PageDialectWordsCreate,
  CreateV2,
  CreateAudio,
  PageDialectPhrasesCreate,
  PageDialectStoriesAndSongsCreate,
  PageDialectStoriesAndSongsBookEntryCreate,
  PageDialectGalleryCreate,
  // CATEGORY
  CategoryBrowse,
  CategoryDetail,
  PageDialectCategoryCreate,
  CategoryCreate,
  CategoryEdit,
  // PHRASEBOOK
  PhrasebookBrowse,
  PhrasebookDetail,
  PageDialectPhraseBooksCreate,
  PhrasebookCreate,
  PhrasebookEdit,
  // CONTRIBUTOR
  ContributorBrowse,
  ContributorDetail,
  ContributorCreateV1,
  ContributorCreate,
  ContributorEdit,
  // RECORDER
  RecorderBrowse,
  RecorderCreate,
  RecorderDetail,
  RecorderEdit,
  // DASHBOARD
  Dashboard,
  DashboardDetail,
}

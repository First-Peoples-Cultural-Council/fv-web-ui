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

import PageExploreDialects from 'views/pages/ExploreDialects'
import PageExploreFamily from 'views/pages/ExploreFamily'
import PageExploreLanguage from 'views/pages/ExploreLanguage'
import PageExploreDialect from 'views/pages/explore/dialect'

import PageDialectLearn from 'views/pages/explore/dialect/learn'
import PageDialectMedia from 'views/pages/explore/dialect/media'
import PageDialectPlay from 'views/pages/explore/dialect/play'

import PageJigsawGame from 'views/pages/explore/dialect/play/jigsaw'
import PageWordSearch from 'views/pages/explore/dialect/play/wordsearch'
import PageColouringBook from 'views/pages/explore/dialect/play/colouringbook'
import PagePictureThis from 'views/pages/explore/dialect/play/picturethis'
import PageHangman from 'views/pages/explore/dialect/play/hangman'
import PageWordscramble from 'views/pages/explore/dialect/play/wordscramble'
import PageQuiz from 'views/pages/explore/dialect/play/quiz'
import PageConcentration from 'views/pages/explore/dialect/play/concentration'

import PageDialectGalleries from 'views/pages/explore/dialect/gallery'
import PageDialectGalleryView from 'views/pages/explore/dialect/gallery/view'
import PageDialectReports from 'views/pages/explore/dialect/reports'
import PageDialectReportsView from 'views/pages/explore/dialect/reports/view'
import PageDialectUsers from 'views/pages/explore/dialect/users'

import PageDialectLearnWords from 'components/Words/WordsContainer'
import PageDialectLearnPhrases from 'views/pages/explore/dialect/learn/phrases'
import PageDialectLearnStoriesAndSongs from 'views/pages/explore/dialect/learn/songs-stories'

import PageDialectViewMedia from 'views/pages/explore/dialect/media/view'
import PageDialectViewWord from 'components/Word/WordContainer'
import PageDialectViewPhrase from 'components/Phrase/PhraseContainer'
import PageDialectViewBook from 'components/SongStory/SongStoryContainer'
import PageDialectViewAlphabet from 'views/pages/explore/dialect/learn/alphabet/'
import PageDialectViewCharacter from 'views/pages/explore/dialect/learn/alphabet/view'
import PageDialectLearnWordsCategories from 'views/pages/explore/dialect/learn/words/categories'

import PhraseBooksGrid from 'components/PhraseBooksGrid'
import WordsCategoriesGrid from 'components/WordsCategoriesGrid'
import PageDialectLearnPhrasesByPhrasebook from 'views/pages/explore/dialect/learn/phrases/phrasesFilteredByPhrasebook'

import PageDialectImmersionList from 'views/pages/explore/dialect/immersion'

import PageTest from 'views/pages/test.js'
import PageDebugAPI from 'views/pages/debug-api.js'
import PageDebugTypography from 'views/pages/debug-typography.js'
import PageError from 'views/pages/error.js'
import PageHome from 'views/pages/HomeLayout'
import PageContent from 'views/pages/content'
import PagePlay from 'views/pages/play'
import PageSearch from 'views/pages/search'
import PageTasks from 'components/Tasks/TasksContainer'
import PageUserTasks from 'views/pages/userTasks'
import PageUsersRegister from 'views/pages/users/register'
import PageUsersForgotPassword from 'views/pages/users/forgotpassword'
import PageUsersProfile from 'views/pages/users/profile'

// KIDS
import KidsHome from 'components/KidsHome'
import KidsPhrasesByPhrasebook from 'components/KidsPhrasesByPhrasebook/KidsPhrasesByPhrasebookContainer'
import KidsWordsByCategory from 'components/KidsWordsByCategory/KidsWordsByCategoryContainer'

// EDIT
import PageExploreDialectEdit from 'views/pages/explore/dialect/ExploreDialectEdit'
import PageDialectGalleryEdit from 'views/pages/explore/dialect/gallery/edit'
import PageDialectEditMedia from 'views/pages/explore/dialect/media/edit'
import PageDialectWordEdit from 'views/pages/explore/dialect/learn/words/Edit'
import PageDialectPhraseEdit from 'views/pages/explore/dialect/learn/phrases/Edit'
import PageDialectBookEdit from 'views/pages/explore/dialect/learn/songs-stories/edit'
import PageDialectBookEntryEdit from 'views/pages/explore/dialect/learn/songs-stories/entry/edit'
import PageDialectAlphabetCharacterEdit from 'views/pages/explore/dialect/learn/alphabet/edit'

// CREATE
import { default as PageDialectWordsCreate } from 'views/pages/explore/dialect/learn/words/Create'
import { default as CreateV2 } from 'views/pages/explore/dialect/create/Word'
import { default as CreateAudio } from 'views/pages/explore/dialect/create/Audio'
import { default as PageDialectPhrasesCreate } from 'views/pages/explore/dialect/learn/phrases/Create'
import { default as PageDialectStoriesAndSongsCreate } from 'views/pages/explore/dialect/learn/songs-stories/create'
import { default as PageDialectStoriesAndSongsBookEntryCreate } from 'views/pages/explore/dialect/learn/songs-stories/entry/create'
import { default as PageDialectGalleryCreate } from 'views/pages/explore/dialect/gallery/create'

// CATEGORY
// ----------------------
import CategoryBrowse from 'views/pages/explore/dialect/Categories' // Browse
import { default as CategoryDetail } from 'views/pages/explore/dialect/Category/detail' // Detail
import { default as PageDialectCategoryCreate } from 'views/pages/explore/dialect/Category/createV1' // Create V1 for modal
import { default as CategoryCreate } from 'views/pages/explore/dialect/Category/create' // Create
import { default as CategoryEdit } from 'views/pages/explore/dialect/Category/edit' // Edit

// CONTRIBUTOR
// ----------------------
import ContributorBrowse from 'views/pages/explore/dialect/contributors' // Browse
import { default as ContributorDetail } from 'views/pages/explore/dialect/Contributor/detail' // Detail
import { default as ContributorCreateV1 } from 'views/pages/explore/dialect/Contributor/createV1' // Create V1
import { default as ContributorCreate } from 'views/pages/explore/dialect/Contributor/create' // Create V2
import { default as ContributorEdit } from 'views/pages/explore/dialect/Contributor/edit' // Edit

// PHRASEBOOK
// ----------------------
import PhrasebookBrowse from 'views/pages/explore/dialect/Phrasebooks' // Browse
import { default as PhrasebookDetail } from 'views/pages/explore/dialect/Phrasebook/detail' // Detail
import { default as PageDialectPhraseBooksCreate } from 'views/pages/explore/dialect/Phrasebook/createV1' // Create V1
import { default as PhrasebookCreate } from 'views/pages/explore/dialect/Phrasebook/create' // Create V2
import { default as PhrasebookEdit } from 'views/pages/explore/dialect/Phrasebook/edit' // Edit

// RECORDER
// ----------------------
import RecorderBrowse from 'views/pages/explore/dialect/Recorders' // Browse
import { default as RecorderDetail } from 'views/pages/explore/dialect/Recorder/detail' // Detail
import { default as RecorderCreate } from 'views/pages/explore/dialect/Recorder/create' // Create
import { default as RecorderEdit } from 'views/pages/explore/dialect/Recorder/edit' // Edit

// DASHBOARD
// ----------------------
import Dashboard from 'components/Dashboard'
import DashboardDetailTasks from 'components/DashboardDetailTasks'

// MENTOR-APPRENTICE PHOTO PROJECT
// ----------------------
import PageMAPPhotoProject from 'views/pages/photo-project'

export {
  PageTest,
  PageMAPPhotoProject,
  PageDebugAPI,
  PageDebugTypography,
  PageError,
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
  DashboardDetailTasks,
}

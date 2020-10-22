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
import PageExploreDialect from 'views/pages/ExploreDialect'

import PageDialectLearn from 'views/pages/DialectLearn'
import PageDialectMedia from 'views/pages/Media'
import PageDialectPlay from 'views/pages/Games'

import PageJigsawGame from 'views/pages/Games/jigsaw'
import PageWordSearch from 'views/pages/Games/wordsearch'
import PageColouringBook from 'views/pages/Games/colouringbook'
import PagePictureThis from 'views/pages/Games/picturethis'
import PageHangman from 'views/pages/Games/hangman'
import PageWordscramble from 'views/pages/Games/wordscramble'
import PageQuiz from 'views/pages/Games/quiz'
import PageConcentration from 'views/pages/Games/concentration'

import PageDialectGalleries from 'views/pages/Gallery'
import PageDialectGalleryView from 'views/pages/Gallery/view'
import PageDialectReports from 'views/pages/Reports'
import PageDialectReportsView from 'views/pages/Reports/view'
import PageDialectUsers from 'views/pages/Users'

import PageDialectLearnWords from 'components/Words/WordsContainer'
import PageDialectLearnPhrases from 'views/pages/Phrases'
import PageDialectLearnStoriesAndSongs from 'views/pages/SongsStories'

import PageDialectViewMedia from 'views/pages/Media/view'
import PageDialectViewWord from 'components/Word/WordContainer'
import PageDialectViewPhrase from 'components/Phrase/PhraseContainer'
import PageDialectViewBook from 'components/SongStory/SongStoryContainer'
import PageDialectViewAlphabet from 'views/pages/Alphabet/'
import PageDialectViewCharacter from 'views/pages/Alphabet/view'
import PageDialectLearnWordsCategories from 'components/Categories/WordCategories'

import PhraseBooksGrid from 'components/PhraseBooksGrid'
import WordsCategoriesGrid from 'components/WordsCategoriesGrid'
import PageDialectLearnPhrasesByPhrasebook from 'views/pages/Phrases/phrasesFilteredByPhrasebook'

import PageDialectImmersionList from 'views/pages/immersion'

import PageTest from 'views/pages/Test'
import PageDebugAPI from 'views/pages/PageDebugAPI'
import PageDebugTypography from 'views/pages/DebugTypography'
import PageError from 'views/pages/PageError'
import PageHome from 'views/pages/HomeLayout'
import PageContent from 'views/pages/PageContent'
import PagePlay from 'views/pages/Games'
import PageSearch from 'views/pages/Search'
import PageTasks from 'components/Tasks/TasksContainer'
import PageUserTasks from 'views/pages/UserTasks'
import PageUsersRegister from 'views/pages/Register'
import PageUsersForgotPassword from 'views/pages/Users/forgotpassword'
import PageUsersProfile from 'views/pages/Users/profile'

// KIDS
import KidsHome from 'components/KidsHome'
import KidsPhrasesByPhrasebook from 'components/KidsPhrasesByPhrasebook/KidsPhrasesByPhrasebookContainer'
import KidsWordsByCategory from 'components/KidsWordsByCategory/KidsWordsByCategoryContainer'

// EDIT
import PageExploreDialectEdit from 'views/pages/ExploreDialectEdit'
import PageDialectGalleryEdit from 'views/pages/Gallery/edit'
import PageDialectEditMedia from 'views/pages/Media/edit'
import PageDialectWordEdit from 'views/pages/WordsCreateEdit/Edit'
import PageDialectPhraseEdit from 'views/pages/Phrases/Edit'
import PageDialectBookEdit from 'views/pages/SongsStories/edit'
import PageDialectBookEntryEdit from 'views/pages/SongsStories/entry/edit'
import PageDialectAlphabetCharacterEdit from 'views/pages/Alphabet/edit'

// CREATE
import { default as PageDialectWordsCreate } from 'views/pages/WordsCreateEdit/Create'
import { default as CreateV2 } from 'views/pages/WordsCreateEdit/CreateV2'
import { default as CreateAudio } from 'views/pages/Audio'
import { default as PageDialectPhrasesCreate } from 'views/pages/Phrases/Create'
import { default as PageDialectStoriesAndSongsCreate } from 'views/pages/SongsStories/create'
import { default as PageDialectStoriesAndSongsBookEntryCreate } from 'views/pages/SongsStories/entry/create'
import { default as PageDialectGalleryCreate } from 'views/pages/Gallery/create'

// CATEGORY
// ----------------------
import CategoryBrowse from 'components/Categories' // Browse
import { default as CategoryDetail } from 'views/pages/Category/detail' // Detail
import { default as PageDialectCategoryCreate } from 'views/pages/Category/createV1' // Create V1 for modal
import { default as CategoryCreate } from 'views/pages/Category/create' // Create
import { default as CategoryEdit } from 'views/pages/Category/edit' // Edit

// CONTRIBUTOR
// ----------------------
import ContributorBrowse from 'views/pages/Contributors' // Browse
import { default as ContributorDetail } from 'views/pages/Contributor/detail' // Detail
import { default as ContributorCreateV1 } from 'views/pages/Contributor/createV1' // Create V1
import { default as ContributorCreate } from 'views/pages/Contributor/create' // Create V2
import { default as ContributorEdit } from 'views/pages/Contributor/edit' // Edit

// PHRASEBOOK
// ----------------------
import PhrasebookBrowse from 'views/pages/Phrasebooks' // Browse
import { default as PhrasebookDetail } from 'views/pages/Phrasebook/detail' // Detail
import { default as PageDialectPhraseBooksCreate } from 'views/pages/Phrasebook/createV1' // Create V1
import { default as PhrasebookCreate } from 'views/pages/Phrasebook/create' // Create V2
import { default as PhrasebookEdit } from 'views/pages/Phrasebook/edit' // Edit

// RECORDER
// ----------------------
import RecorderBrowse from 'views/pages/Recorders' // Browse
import { default as RecorderDetail } from 'views/pages/Recorder/detail' // Detail
import { default as RecorderCreate } from 'views/pages/Recorder/create' // Create
import { default as RecorderEdit } from 'views/pages/Recorder/edit' // Edit

// DASHBOARD
// ----------------------
import Dashboard from 'components/Dashboard'
import DashboardDetailTasks from 'components/DashboardDetailTasks'

// MENTOR-APPRENTICE PHOTO PROJECT
// ----------------------
import PageMAPPhotoProject from 'views/pages/PhotoProject'

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

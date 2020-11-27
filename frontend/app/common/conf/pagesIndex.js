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

import PageExploreDialects from 'components/ExploreDialects'
import PageExploreFamily from 'components/ExploreFamily'
import PageExploreLanguage from 'components/ExploreLanguage'
import PageExploreDialect from 'components/ExploreDialect'

import PageDialectLearn from 'components/DialectLearn'
import PageDialectMedia from 'components/Media'
import PageDialectPlay from 'components/Games'

import PageJigsawGame from 'components/Games/jigsaw'
import PageWordSearch from 'components/Games/wordsearch'
import PageColouringBook from 'components/Games/colouringbook'
import PagePictureThis from 'components/Games/picturethis'
import PageHangman from 'components/Games/hangman'
import PageWordscramble from 'components/Games/wordscramble'
import PageQuiz from 'components/Games/quiz'
import PageConcentration from 'components/Games/concentration'

import PageDialectGalleries from 'components/Gallery'
import PageDialectGalleryView from 'components/Gallery/view'
import PageDialectReports from 'components/Reports'
import PageDialectReportsView from 'components/Reports/ReportsView'

import PageDialectLearnWords from 'components/Words/WordsContainer'
import PageDialectLearnPhrases from 'components/Phrases/PhrasesContainer'
import PageDialectLearnStoriesAndSongs from 'components/SongsStories'

import PageDialectViewMedia from 'components/Media/view'
import PageDialectViewWord from 'components/Word/WordContainer'
import PageDialectViewPhrase from 'components/Phrase/PhraseContainer'
import PageDialectViewBook from 'components/SongStory/SongStoryContainer'
import PageDialectViewAlphabet from 'components/Alphabet/'
import PageDialectViewCharacter from 'components/AlphabetDetail/AlphabetDetailContainer'
import PageDialectLearnWordsCategories from 'components/Categories/WordCategories'

import PhraseBooksGrid from 'components/PhraseBooksGrid'
import WordsCategoriesGrid from 'components/WordsCategoriesGrid'

import PageDialectImmersionList from 'components/Immersion'

import PageTest from 'components/Test'
import PageDebugAPI from 'components/PageDebugAPI'
import PageDebugTypography from 'components/DebugTypography'
import PageError from 'components/PageError'
import PageHome from 'components/HomeLayout'
import PageContent from 'components/PageContent'
import PagePlay from 'components/Games'
import PageSearch from 'components/SearchDictionary/SearchDictionaryContainer'
import PageTasks from 'components/Tasks/TasksContainer'
import PageUserTasks from 'components/UserTasks'
import PageUsersRegister from 'components/Register'
import PageUsersForgotPassword from 'components/Users/forgotpassword'

// KIDS
import KidsHome from 'components/KidsHome'
import KidsPhrasesByPhrasebook from 'components/KidsPhrasesByPhrasebook/KidsPhrasesByPhrasebookContainer'
import KidsWordsByCategory from 'components/KidsWordsByCategory/KidsWordsByCategoryContainer'

// EDIT
import PageExploreDialectEdit from 'components/ExploreDialectEdit'
import PageDialectGalleryEdit from 'components/Gallery/edit'
import PageDialectEditMedia from 'components/Media/edit'
import PageDialectWordEdit from 'components/WordsCreateEdit/Edit'
import PageDialectPhraseEdit from 'components/PhrasesCreateEdit/Edit'
import PageDialectBookEdit from 'components/SongsStories/edit'
import PageDialectBookEntryEdit from 'components/SongsStories/entry/edit'
import PageDialectAlphabetCharacterEdit from 'components/Alphabet/edit'

// CREATE
import { default as PageDialectWordsCreate } from 'components/WordsCreateEdit/Create'
import { default as CreateV2 } from 'components/WordsCreateEdit/CreateV2'
import { default as CreateAudio } from 'components/Audio'
import { default as PageDialectPhrasesCreate } from 'components/PhrasesCreateEdit/Create'
import { default as PageDialectStoriesAndSongsCreate } from 'components/SongsStories/create'
import { default as PageDialectStoriesAndSongsBookEntryCreate } from 'components/SongsStories/entry/create'
import { default as PageDialectGalleryCreate } from 'components/Gallery/create'

// CATEGORY
// ----------------------
import CategoryBrowse from 'components/Categories' // Browse
import { default as CategoryDetail } from 'components/Category/detail' // Detail
import { default as PageDialectCategoryCreate } from 'components/Category/createV1' // Create V1 for modal
import { default as CategoryCreate } from 'components/Category/create' // Create
import { default as CategoryEdit } from 'components/Category/edit' // Edit

// CONTRIBUTOR
// ----------------------
import ContributorBrowse from 'components/Contributors' // Browse
import { default as ContributorDetail } from 'components/Contributor/detail' // Detail
import { default as ContributorCreateV1 } from 'components/Contributor/createV1' // Create V1
import { default as ContributorCreate } from 'components/Contributor/create' // Create V2
import { default as ContributorEdit } from 'components/Contributor/edit' // Edit

// PHRASEBOOK
// ----------------------
import PhrasebookBrowse from 'components/Phrasebooks' // Browse
import { default as PhrasebookDetail } from 'components/Phrasebook/detail' // Detail
import { default as PageDialectPhraseBooksCreate } from 'components/Phrasebook/createV1' // Create V1
import { default as PhrasebookCreate } from 'components/Phrasebook/create' // Create V2
import { default as PhrasebookEdit } from 'components/Phrasebook/edit' // Edit

// RECORDER
// ----------------------
import RecorderBrowse from 'components/Recorders' // Browse
import { default as RecorderDetail } from 'components/Recorder/detail' // Detail
import { default as RecorderCreate } from 'components/Recorder/create' // Create
import { default as RecorderEdit } from 'components/Recorder/edit' // Edit

// DASHBOARD
// ----------------------
import Dashboard from 'components/Dashboard'
import DashboardDetailTasks from 'components/DashboardDetailTasks'

// MENTOR-APPRENTICE PHOTO PROJECT
// ----------------------
import PageMAPPhotoProject from 'components/PhotoProject'

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
  PagePlay,
  PageSearch,
  PageTasks,
  PageUserTasks,
  PageUsersRegister,
  PageUsersForgotPassword,
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

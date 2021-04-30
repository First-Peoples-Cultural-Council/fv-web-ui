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
import React from 'react'

const PageExploreDialects = React.lazy(() => import('components/ExploreDialects'))
const PageExploreFamily = React.lazy(() => import('components/ExploreFamily'))
const PageExploreLanguage = React.lazy(() => import('components/ExploreLanguage'))
const PageExploreDialect = React.lazy(() => import('components/ExploreDialect'))

const PageDialectLearn = React.lazy(() => import('components/DialectLearn'))
const PageDialectMedia = React.lazy(() => import('components/Media'))
const PageDialectPlay = React.lazy(() => import('components/Games'))

const PageJigsawGame = React.lazy(() => import('components/Games/jigsaw'))
const PageWordSearch = React.lazy(() => import('components/Games/wordsearch'))
const PageParachute = React.lazy(() => import('components/Games/parachute'))
const PageWordscramble = React.lazy(() => import('components/Games/wordscramble'))
const PageQuiz = React.lazy(() => import('components/Games/quiz'))
const PageConcentration = React.lazy(() => import('components/Games/concentration'))

const PageDialectGalleries = React.lazy(() => import('components/Gallery'))
const PageDialectGalleryView = React.lazy(() => import('components/Gallery/view'))
const PageDialectReports = React.lazy(() => import('components/Reports'))
const PageDialectReportsView = React.lazy(() => import('components/Reports/ReportsView'))

const PageDialectLearnWords = React.lazy(() => import('components/Words/WordsContainer'))
const PageDialectLearnPhrases = React.lazy(() => import('components/Phrases/PhrasesContainer'))
const PageDialectLearnStoriesAndSongs = React.lazy(() => import('components/SongsStories'))

const PageDialectViewMedia = React.lazy(() => import('components/Media/view'))
const PageDialectViewWord = React.lazy(() => import('components/Word/WordContainer'))
const PageDialectViewPhrase = React.lazy(() => import('components/Phrase/PhraseContainer'))
const PageDialectViewBook = React.lazy(() => import('components/SongStory/SongStoryContainer'))
const PageDialectViewAlphabet = React.lazy(() => import('components/Alphabet/AlphabetPage'))
const PageDialectViewCharacter = React.lazy(() => import('components/AlphabetDetail/AlphabetDetailContainer'))
const PageDialectLearnWordsCategories = React.lazy(() => import('components/Categories/WordCategories'))

const PhraseBooksGridContainer = React.lazy(() => import('components/PhraseBooksGrid/PhraseBooksGridContainer'))
const WordsCategoriesGridContainer = React.lazy(() =>
  import('components/WordsCategoriesGrid/WordsCategoriesGridContainer')
)

const PageDialectImmersionList = React.lazy(() => import('components/Immersion'))

const PageDebugAPI = React.lazy(() => import('components/PageDebugAPI'))
const PageDebugTypography = React.lazy(() => import('components/DebugTypography'))
const PageError = React.lazy(() => import('components/PageError'))
const PageHome = React.lazy(() => import('components/HomeLayout'))
const PageContent = React.lazy(() => import('components/PageContent'))
const PagePlay = React.lazy(() => import('components/Games'))
const PageSearch = React.lazy(() => import('components/SearchDictionary/SearchDictionaryContainer'))
const PageUserTasks = React.lazy(() => import('components/UserTasks'))
const PageUsersRegister = React.lazy(() => import('components/Register'))
const PageUsersForgotPassword = React.lazy(() => import('components/Users/forgotpassword'))

// KIDS
const KidsHome = React.lazy(() => import('components/KidsHome'))
const KidsPhrasesByPhrasebook = React.lazy(() =>
  import('components/KidsPhrasesByPhrasebook/KidsPhrasesByPhrasebookContainer')
)
const KidsWordsByCategory = React.lazy(() => import('components/KidsWordsByCategory/KidsWordsByCategoryContainer'))

// EDIT
const PageExploreDialectEdit = React.lazy(() => import('components/ExploreDialectEdit'))
const PageDialectGalleryEdit = React.lazy(() => import('components/Gallery/edit'))
const PageDialectEditMedia = React.lazy(() => import('components/Media/edit'))
const PageDialectWordEdit = React.lazy(() => import('components/WordsCreateEdit/Edit'))
const PageDialectPhraseEdit = React.lazy(() => import('components/PhrasesCreateEdit/Edit'))
const PageDialectBookEdit = React.lazy(() => import('components/SongsStories/edit'))
const PageDialectBookEntryEdit = React.lazy(() => import('components/SongsStories/entry/edit'))
const PageDialectAlphabetCharacterEdit = React.lazy(() => import('components/Alphabet/edit'))

// CREATE
const PageDialectWordsCreate = React.lazy(() => import('components/WordsCreateEdit/Create'))
const CreateV2 = React.lazy(() => import('components/WordsCreateEdit/CreateV2'))
const CreateAudio = React.lazy(() => import('components/Audio'))
const PageDialectPhrasesCreate = React.lazy(() => import('components/PhrasesCreateEdit/Create'))
const PageDialectStoriesAndSongsCreate = React.lazy(() => import('components/SongsStories/create'))
const PageDialectStoriesAndSongsBookEntryCreate = React.lazy(() => import('components/SongsStories/entry/create'))
const PageDialectGalleryCreate = React.lazy(() => import('components/Gallery/create'))

// CATEGORY
// ----------------------
const CategoryBrowse = React.lazy(() => import('components/Categories')) // Browse
const CategoryDetail = React.lazy(() => import('components/Category/detail')) // Detail
const PageDialectCategoryCreate = React.lazy(() => import('components/Category/createV1')) // Create V1 for modal
const CategoryCreate = React.lazy(() => import('components/Category/create')) // Create
const CategoryEdit = React.lazy(() => import('components/Category/edit')) // Edit

// CONTRIBUTOR
// ----------------------
const ContributorBrowse = React.lazy(() => import('components/Contributors')) // Browse
const ContributorDetail = React.lazy(() => import('components/Contributor/detail')) // Detail
const ContributorCreateV1 = React.lazy(() => import('components/Contributor/createV1')) // Create V1
const ContributorCreate = React.lazy(() => import('components/Contributor/create')) // Create V2
const ContributorEdit = React.lazy(() => import('components/Contributor/edit')) // Edit

// PHRASEBOOK
// ----------------------
const PhrasebookBrowse = React.lazy(() => import('components/Phrasebooks')) // Browse
const PhrasebookDetail = React.lazy(() => import('components/Phrasebook/detail')) // Detail
const PageDialectPhraseBooksCreate = React.lazy(() => import('components/Phrasebook/createV1')) // Create V1
const PhrasebookCreate = React.lazy(() => import('components/Phrasebook/create')) // Create V2
const PhrasebookEdit = React.lazy(() => import('components/Phrasebook/edit')) // Edit

// RECORDER
// ----------------------
const RecorderBrowse = React.lazy(() => import('components/Recorders')) // Browse
const RecorderDetail = React.lazy(() => import('components/Recorder/detail')) // Detail
const RecorderCreate = React.lazy(() => import('components/Recorder/create')) // Create
const RecorderEdit = React.lazy(() => import('components/Recorder/edit')) // Edit

// DASHBOARD
// ----------------------
const DashboardContainer = React.lazy(() => import('components/Dashboard/DashboardContainer'))
const DashboardDetailTasksContainer = React.lazy(() =>
  import('components/DashboardDetailTasks/DashboardDetailTasksContainer')
)

// MENTOR-APPRENTICE PHOTO PROJECT
// ----------------------
const PageMAPPhotoProject = React.lazy(() => import('components/PhotoProject'))

export {
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
  PhraseBooksGridContainer,
  WordsCategoriesGridContainer,
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
  PageUserTasks,
  PageUsersRegister,
  PageUsersForgotPassword,
  PageDialectImmersionList,
  //GAMES
  PageJigsawGame,
  PageWordSearch,
  PageConcentration,
  PageParachute,
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
  DashboardContainer,
  DashboardDetailTasksContainer,
}

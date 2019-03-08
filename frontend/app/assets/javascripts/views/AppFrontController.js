import React, { Component, PropTypes } from "react"
import Immutable from "immutable"

import provide from "react-redux-provide"
import selectn from "selectn"

import classNames from "classnames"

import ConfGlobal from "conf/local.json"

import ProviderHelpers from "common/ProviderHelpers"
import UIHelpers from "common/UIHelpers"
import StringHelpers from "common/StringHelpers"
import AnalyticsHelpers from "common/AnalyticsHelpers"

import { Link } from "provide-page"

import FlatButton from "material-ui/lib/flat-button"
import Navigation from "views/components/Navigation"
import WorkspaceSwitcher from "views/components/Navigation/workspace-switcher"
import KidsNavigation from "views/components/Kids/Navigation"
import Footer from "views/components/Navigation/Footer"

import {
  PageIntro,
  PageHome,
  PageTest,
  PageError,
  PageKidsHome,
  PageContent,
  PageExploreDialects,
  PageExploreArchive,
  PageExploreFamily,
  PageExploreLanguage,
  PageExploreDialect,
} from "views/pages"

import {
  PageDialectLearn,
  PageDialectMedia,
  PageDialectPlay,
  PageDialectGalleryView,
  PageDialectGalleries,
  PageDialectReports,
  PageDialectReportsView,
  PageDialectUsers,
} from "views/pages"

import {
  PageDialectLearnWords,
  PageDialectLearnPhrases,
  PageDialectLearnStoriesAndSongs,
  PageDialectViewDictionaryItem,
} from "views/pages"

import {
  PageDialectViewWord,
  PageDialectViewPhrase,
  PageDialectViewBook,
  PageDialectViewCharacter,
  PageDialectViewMedia,
} from "views/pages"

import { PageDialectViewAlphabet } from "views/pages"

import {
  PageJigsawGame,
  PageColouringBook,
  PageWordSearch,
  PagePictureThis,
  PageConcentration,
  PageWordscramble,
  PageQuiz,
  PageHangman,
} from "views/pages"

import {
  PagePlay,
  PageSearch,
  PageTasks,
  PageUserTasks,
  PageUsersProfile,
  PageUsersRegister,
  PageUsersForgotPassword,
  PageDialectLearnWordsCategories,
  PageDialectLearnPhrasesCategories,
} from "views/pages"

import {
  PageExploreDialectEdit,
  PageDialectWordEdit,
  PageDialectAlphabetCharacterEdit,
  PageDialectEditMedia,
  PageDialectGalleryEdit,
  PageDialectPhraseEdit,
  PageDialectBookEdit,
  PageDialectBookEntryEdit,
} from "views/pages/edit"
import {
  PageDialectWordsCreate,
  PageDialectPhrasesCreate,
  PageDialectStoriesAndSongsCreate,
  PageDialectGalleryCreate,
  PageDialectCategoryCreate,
  PageDialectPhraseBooksCreate,
  PageDialectContributorsCreate,
  PageDialectStoriesAndSongsBookEntryCreate,
} from "views/pages/create"

import { ServiceShortURL } from "views/services"
import IntlService from "views/services/intl"

const intl = IntlService.instance

/**
 * Parameter matching class
 */
class paramMatch {
  constructor(id, matcher) {
    this.id = id
    this.matcher = matcher
  }
}

const PAGE_NOT_FOUND_TITLE =
  "404 - " +
  intl.translate({
    key: "errors.page_not_found",
    default: "Page Not Found",
    case: "first",
  })

const PAGE_NOT_FOUND_BODY = (
  <div>
    <p>
      {intl.translate({
        key: "errors.report_via_feedback",
        default: "Please report this error so that we can fix it",
        case: "first",
      })}
      .
    </p>
    <p>
      {intl.translate({
        key: "errors.feedback_include_link",
        default: "Include what link or action you took to get to this page",
      })}
      .
    </p>
    <p>
      {intl.translate({
        key: "thank_you!",
        default: "Thank You!",
        case: "words",
      })}
    </p>
  </div>
)

// Regex helper
const ANYTHING_BUT_SLASH = new RegExp(ProviderHelpers.regex.ANYTHING_BUT_SLASH)
const NUMBER = new RegExp("([0-9]+)")
const WORKSPACE_OR_SECTION = new RegExp(ProviderHelpers.regex.WORKSPACE_OR_SECTION)
const ANY_LANGUAGE_CODE = new RegExp(ProviderHelpers.regex.ANY_LANGUAGE_CODE)
const KIDS_OR_DEFAULT = new paramMatch("theme", RegExp(ProviderHelpers.regex.KIDS_OR_DEFAULT))

const REMOVE_FROM_BREADCRUMBS = ["FV", "sections", "Data", "Workspaces", "search"]

const allowedToAccessWorkspaces = function(windowPath, computeLogin, computeDialect2) {
  // Don't perform any redirect if these aren't available.
  if (
    !selectn("success", computeLogin) ||
    !computeDialect2 ||
    !computeDialect2.get(0) ||
    !computeDialect2.get(0).get("response")
  ) {
    return false
  }

  return !ProviderHelpers.isDialectMember(computeLogin, computeDialect2) && !ProviderHelpers.isAdmin(computeLogin)
}

const WORKSPACE_TO_SECTION_REDIRECT = {
  condition: (params) => {
    // Condition 1: Guest and trying to access Workspaces
    // Condition 2: User is a site member (not specific dialect) and trying to access Workspaces
    return (
      (selectn("isConnected", params.props.computeLogin) === false &&
        params.props.splitWindowPath[2] === "Workspaces") ||
      (ProviderHelpers.isSiteMember(selectn("response.properties.groups", params.props.computeLogin)) &&
        params.props.splitWindowPath[2] === "Workspaces")
    )
  },
  target: (params) => {
    return "/" + params.props.splitWindowPath.join("/").replace("Workspaces", "sections")
  },
}

const NOT_CONNECTED_REDIRECT = {
  condition: (params) => {
    return selectn("isConnected", params.props.computeLogin) === false
  },
  target: () => {
    return "/"
  },
}

// Common Paths
const DIALECT_PATH = [
  KIDS_OR_DEFAULT,
  "FV",
  new paramMatch("area", WORKSPACE_OR_SECTION),
  "Data",
  ANYTHING_BUT_SLASH,
  ANYTHING_BUT_SLASH,
  ANYTHING_BUT_SLASH,
]
const PHRASES_PATH = DIALECT_PATH.concat(["learn", "phrases"])
const WORDS_PATH = DIALECT_PATH.concat(["learn", "words"])
const REPORTS_PATH = DIALECT_PATH.concat(["reports"])
const PAGINATION_PATH = [new paramMatch("pageSize", NUMBER), new paramMatch("page", NUMBER)]

// Common Routes
const DIALECT_LEARN_WORDS = {
  path: WORDS_PATH,
  title:
    intl.translate({
      key: "words",
      default: "Words",
      case: "words",
    }) + " | {$dialect_name}",
  page: <PageDialectLearnWords />,
  extractPaths: true,
  redirects: [WORKSPACE_TO_SECTION_REDIRECT],
}

const DIALECT_LEARN_PHRASES = {
  path: PHRASES_PATH,
  title:
    intl.translate({
      key: "views.pages.explore.dialect.learn.phrases.page_title",
      default: "Phrases",
      case: "words",
    }) + " | {$dialect_name}",
  page: <PageDialectLearnPhrases />,
  extractPaths: true,
  redirects: [WORKSPACE_TO_SECTION_REDIRECT],
}

const REPORT_VIEW = {
  path: REPORTS_PATH.concat(new paramMatch("reportName", ANYTHING_BUT_SLASH)),
  title:
    "{$reportName} | " +
    intl.translate({
      key: "reports",
      default: "Reports",
      case: "words",
    }) +
    " | {$dialect_name}",
  page: <PageDialectReportsView />,
  extractPaths: true,
  redirects: [WORKSPACE_TO_SECTION_REDIRECT],
}

// Adds a pagination route to an existing route
const addPagination = (route) => {
  return Object.assign({}, route, {
    path: route.path.concat(PAGINATION_PATH),
    page: React.cloneElement(route.page, { hasPagination: true }),
    breadcrumbPathOverride: (pathArray) => {
      return pathArray.slice(0, pathArray.length - 2)
    },
  })
}

const addCategory = (route) => {
  return Object.assign({}, route, {
    path: route.path.concat(["categories", new paramMatch("category", ANYTHING_BUT_SLASH)]),
    title:
      intl.translate({
        key: "views.pages.explore.dialect.learn.words.page_title_category",
        default: "Category View",
        case: "words",
      }) +
      " | " +
      selectn("title", route),
  })
}

const addBrowseAlphabet = (route) => {
  return Object.assign({}, route, {
    path: route.path.concat(["alphabet", new paramMatch("letter", ANYTHING_BUT_SLASH)]),
    title: "{$letter}" + ` | ${selectn("title", route)}`,
  })
}
const addBrowsePhraseBook = (route) => {
  return Object.assign({}, route, {
    path: route.path.concat(["book", new paramMatch("phraseBook", ANYTHING_BUT_SLASH)]),
    title:
      intl.translate({
        key: "views.pages.explore.dialect.learn.phrases.page_title_phrase_book",
        default: "Browsing by Phrase Book",
        case: "words",
      }) +
      " | " +
      selectn("title", route),
  })
}
// eg: learn/phrases/alphabet/b
const addBrowsePhraseBookByAlphabet = (route) => {
  return Object.assign({}, route, {
    path: route.path.concat(["alphabet", new paramMatch("letter", ANYTHING_BUT_SLASH)]),
    title:
      intl.translate({
        key: "views.pages.explore.dialect.learn.phrases.page_title_phrase_book",
        default: "Browsing Phrase Book alphabetically",
        case: "words",
      }) +
      " | " +
      selectn("title", route),
  })
}

class Redirecter extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.redirect()
  }

  render() {
    return (
      <div style={{ backgroundColor: "#fff", height: "100vh" }}>
        {intl.translate({
          key: "redirecting",
          default: "Redirecting",
          case: "first",
        })}
        ...
      </div>
    )
  }
}

@provide
export default class AppFrontController extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    preferences: PropTypes.object,
    warnings: PropTypes.object.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    changeTheme: PropTypes.func.isRequired,
    // loadGuide: PropTypes.func.isRequired,
    // loadNavigation: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.state = this._getInitialState()

    // Bind methods to 'this'
    ;["_matchPath", "_route", "_updateTitle"].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _getInitialState() {
    const routes = Immutable.fromJS([
      {
        path: [],
        alias: [ANY_LANGUAGE_CODE, "home"],
        page: <PageHome />,
        title: intl.translate({ key: "home", default: "Home", case: "first" }),
        breadcrumbs: false,
        frontpage: true,
        redirects: [
          {
            // For any start page value other than a dialect, simple redirect to that start page
            condition: (params) => {
              return (
                selectn("preferences.start_page", params.props) !== undefined &&
                selectn("preferences.start_page", params.props) !== "my_dialect" &&
                selectn("preferences.start_page", params.props) !== "my_kids_dialect"
              )
            },
            target: (params) => {
              return UIHelpers.getPreferenceVal("start_page", params.props.preferences)
            },
          },
          {
            // Redirecting to a dialect (requires dialect_path to be provided)
            condition: (params) => {
              return selectn("preferences.primary_dialect_path", params.props) !== undefined
            },
            target: (params) => {
              const start_page = selectn("preferences.start_page", params.props)
              const primary_dialect_path = selectn("preferences.primary_dialect_path", params.props)
              return (
                "/" +
                (start_page === "my_kids_dialect" ? "kids" : "explore") +
                selectn("preferences.primary_dialect_path", params.props)
              )
            },
          },
        ],
      },
      {
        path: ["content", new paramMatch("friendly_url", ANYTHING_BUT_SLASH)],
        page: <PageContent area="sections" />,
        title: "{$pageTitle} | " + intl.translate({ key: "pages", default: "Pages", case: "first" }),
        breadcrumbs: false,
      },
      {
        path: ["content-preview", new paramMatch("friendly_url", ANYTHING_BUT_SLASH)],
        page: <PageContent area="Workspaces" />,
        title: "{$pageTitle} | " + intl.translate({ key: "pages", default: "Pages", case: "first" }),
        breadcrumbs: false,
      },
      {
        path: ["test"],
        page: <PageTest />,
      },
      {
        path: [new paramMatch("theme", new RegExp("kids"))],
        frontpage: true,
        title: intl.translate({ key: "kids_home", default: "Kids Home", case: "words" }),
        page: <PageKidsHome />,
      },
      {
        path: ["play"],
        title: intl.translate({ key: "games", default: "Games", case: "first" }),
        page: <PagePlay />,
      },
      {
        path: ["tasks"],
        title: intl.translate({ key: "tasks", default: "Tasks", case: "first" }),
        page: <PageTasks />,
      },
      {
        path: ["tasks", "users", new paramMatch("dialect", ANYTHING_BUT_SLASH)],
        title: intl.translate({ key: "tasks", default: "Tasks", case: "first" }),
        page: <PageUserTasks type="users" />,
        breadcrumbs: false,
      },
      {
        path: ["register"],
        title: intl.translate({ key: "register", default: "Register", case: "first" }),
        page: <PageUsersRegister />,
      },
      {
        path: ["profile"],
        title: intl.translate({ key: "user_profile", default: "User Profile", case: "words" }),
        page: <PageUsersProfile />,
        redirects: [NOT_CONNECTED_REDIRECT],
      },
      {
        path: ["forgotpassword"],
        title: intl.translate({ key: "forgot_password", default: "Forgot Password", case: "words" }),
        breadcrumbs: false,
        page: <PageUsersForgotPassword />,
      },
      {
        path: [KIDS_OR_DEFAULT],
        page: <PageExploreArchive />,
        redirects: [
          {
            condition: () => {
              return true
            },
            target: () => {
              return "/explore/FV/sections/Data/"
            },
          },
        ],
      },
      {
        path: [new paramMatch("area", WORKSPACE_OR_SECTION), new paramMatch("dialectFriendlyName", ANYTHING_BUT_SLASH)],
        title: intl.translate({
          key: "dialect_short_url",
          default: "Dialect Short Url",
          case: "words",
        }),
        page: <ServiceShortURL />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          "t",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          new paramMatch("dialectFriendlyName", ANYTHING_BUT_SLASH),
          new paramMatch("appendPath", new RegExp("(.*)")),
        ],
        title: intl.translate({
          key: "dialect_short_url",
          default: "Dialect Short Url",
          case: "words",
        }),
        page: <ServiceShortURL />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [KIDS_OR_DEFAULT, "FV", new paramMatch("area", WORKSPACE_OR_SECTION), "Data"],
        title: intl.translate({
          key: "x_dialects",
          default: "{$theme} Dialects",
          params: ["{$theme}"],
        }),
        // title: '{$theme} Dialects',
        page: <PageExploreDialects />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          "search",
          new paramMatch("searchTerm", ANYTHING_BUT_SLASH),
        ],
        title:
          "'{$searchTerm}' " +
          intl.translate({
            key: "views.pages.search.search_results",
            default: "Search Results",
            case: "words",
          }),
        page: <PageSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "search",
          new paramMatch("searchTerm", ANYTHING_BUT_SLASH),
        ],
        title:
          "'{$searchTerm}' " +
          intl.translate({
            key: "views.pages.search.search_results",
            default: "Search Results",
            case: "words",
          }) +
          " | {$dialect_name} ",
        page: <PageSearch />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "register",
        ],
        title:
          "{$dialect_name} " +
          intl.translate({
            key: "registration",
            default: "Registration",
            case: "words",
          }),
        page: <PageUsersRegister />,
        disableWorkspaceSectionNav: true,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          new paramMatch("language_family", ANYTHING_BUT_SLASH),
        ],
        title:
          "{$language_family_name} " +
          intl.translate({
            key: "explore",
            default: "Explore",
            case: "words",
          }),
        page: <PageExploreFamily />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
        ],
        title:
          "{$language_name} " +
          intl.translate({
            key: "explore",
            default: "Explore",
            case: "words",
          }),
        page: <PageExploreLanguage />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        id: "page_explore_dialect",
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
        ],
        title:
          "{$dialect_name} " +
          intl.translate({
            key: "home",
            default: "Home",
            case: "first",
          }) +
          " | {$theme}",
        page: <PageExploreDialect />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        warnings: ["multiple_dialects"],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "edit",
        ],
        title: intl.translate({ key: "edit", default: "Edit", case: "words" }) + " {$dialect_name}",
        page: <PageExploreDialectEdit />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
        ],
        title:
          intl.translate({
            key: "learn",
            default: "Learn",
            case: "words",
          }) + " {$dialect_name}",
        page: <PageDialectLearn />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "media",
        ],
        title:
          intl.translate({
            key: "browse_media",
            default: "Browse Media",
            case: "words",
          }) + " | {$dialect_name}",
        page: <PageDialectMedia />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "media",
          new paramMatch("media", ANYTHING_BUT_SLASH),
        ],
        title:
          "{$media} | " +
          intl.translate({
            key: "media",
            default: "Media",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectViewMedia />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "media",
          new paramMatch("media", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "edit",
            default: "Edit",
            case: "words",
          }) +
          " {$media} | " +
          intl.translate({
            key: "media",
            default: "Media",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectEditMedia />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "alphabet",
        ],
        title:
          intl.translate({
            key: "alphabet",
            default: "Alphabet",
            case: "words",
          }) + " | {$dialect_name}",
        page: <PageDialectViewAlphabet />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "alphabet",
          "print",
        ],
        title:
          intl.translate({
            key: "print_alphabet",
            default: "Print Alphabet",
            case: "words",
          }) + " | {$dialect_name}",
        page: <PageDialectViewAlphabet print />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "alphabet",
          new paramMatch("character", ANYTHING_BUT_SLASH),
        ],
        title:
          intl.translate({
            key: "character",
            default: "Character",
            case: "words",
          }) +
          " - {$character} | " +
          intl.translate({
            key: "alphabet",
            default: "Alphabet",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectViewCharacter />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "alphabet",
          new paramMatch("character", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "edit",
            default: "Edit",
            case: "words",
          }) +
          " {$character} " +
          intl.translate({
            key: "character",
            default: "Character",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "print_alphabet",
            default: "Print Alphabet",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectAlphabetCharacterEdit />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
        ],
        title:
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) + " | {$dialect_name}",
        page: <PageDialectPlay />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
          "jigsaw",
        ],
        title:
          intl.translate({
            key: "jigsaw",
            default: "Jigsaw",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageJigsawGame />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
          "wordsearch",
        ],
        title:
          intl.translate({
            key: "word_search",
            default: "Word Search",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageWordSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
          "colouringbook",
        ],
        title:
          intl.translate({
            key: "coloring_book",
            default: "Coloring Book",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageColouringBook />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
          "concentration",
        ],
        title:
          intl.translate({
            key: "memory_game",
            default: "Memory Game",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageConcentration />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
          "picturethis",
        ],
        title:
          intl.translate({
            key: "picture_this",
            default: "Picture This",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PagePictureThis />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
          "hangman",
        ],
        title:
          intl.translate({
            key: "hangman",
            default: "Hangman",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageHangman />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
          "wordscramble",
        ],
        title:
          intl.translate({
            key: "word_scramble",
            default: "Word Scramble",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageWordscramble />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "play",
          "quiz",
        ],
        title:
          intl.translate({
            key: "quiz",
            default: "Quiz",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "games",
            default: "Games",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageQuiz />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "gallery",
        ],
        title:
          intl.translate({
            key: "galleries",
            default: "Galleries",
            case: "words",
          }) + " | {$dialect_name}",
        page: <PageDialectGalleries />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "gallery",
          "create",
        ],
        title:
          intl.translate({
            key: "create_gallery",
            default: "Create Gallery",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "galleries",
            default: "Galleries",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectGalleryCreate />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "gallery",
          new paramMatch("galleryName", ANYTHING_BUT_SLASH),
        ],
        title:
          "{$galleryName} | " +
          intl.translate({
            key: "galleries",
            default: "Galleries",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectGalleryView />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "gallery",
          new paramMatch("gallery", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "edit",
            default: "Edit",
            case: "words",
          }) +
          " {$galleryName} | " +
          intl.translate({
            key: "galleries",
            default: "Galleries",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectGalleryEdit />,
        extractPaths: true,
      },
      {
        path: REPORTS_PATH,
        title:
          intl.translate({
            key: "reports",
            default: "Reports",
            case: "words",
          }) + " | {$dialect_name}",
        page: <PageDialectReports />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      REPORT_VIEW,
      addPagination(REPORT_VIEW),
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "users",
        ],
        title:
          intl.translate({
            key: "users",
            default: "Users",
            case: "words",
          }) + " | {$dialect_name}",
        page: <PageDialectUsers />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      DIALECT_LEARN_WORDS,
      addPagination(DIALECT_LEARN_WORDS),
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "words",
          "categories",
        ],
        title:
          intl.translate({
            key: "categories",
            default: "Categories",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "words",
            default: "Words",
            case: "words",
          }) +
          " | {$dialect_name} | {$theme}",
        page: <PageDialectLearnWordsCategories />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      addBrowseAlphabet(DIALECT_LEARN_WORDS),
      addPagination(addBrowseAlphabet(DIALECT_LEARN_WORDS)),
      addCategory(DIALECT_LEARN_WORDS),
      addPagination(addCategory(DIALECT_LEARN_WORDS)),
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "words",
          "create",
        ],
        title:
          intl.translate({
            key: "create",
            default: "Create",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "words",
            default: "Words",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectWordsCreate />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "words",
          new paramMatch("word", ANYTHING_BUT_SLASH),
        ],
        title:
          "{$word} | " +
          intl.translate({
            key: "words",
            default: "Words",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectViewWord />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "words",
          new paramMatch("word", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "edit_x_word",
            default: "Edit {$word} Word",
            params: ["{$word}"],
          }) +
          " | " +
          intl.translate({
            key: "words",
            default: "Words",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectWordEdit />,
        extractPaths: true,
      },
      DIALECT_LEARN_PHRASES,
      addPagination(DIALECT_LEARN_PHRASES),
      addBrowsePhraseBook(DIALECT_LEARN_PHRASES),
      addPagination(addBrowsePhraseBook(DIALECT_LEARN_PHRASES)),
      addBrowsePhraseBookByAlphabet(DIALECT_LEARN_PHRASES),
      addPagination(addBrowsePhraseBookByAlphabet(DIALECT_LEARN_PHRASES)),
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "phrases",
          "categories",
        ],
        title:
          intl.translate({
            key: "phrase_categories",
            default: "Phrase Categories",
            case: "words",
          }) + " | {$dialect_name} | {$theme}",
        page: <PageDialectLearnPhrasesCategories />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      addCategory(DIALECT_LEARN_PHRASES),
      addPagination(addCategory(DIALECT_LEARN_PHRASES)),
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "phrases",
          "create",
        ],
        title:
          intl.translate({
            key: "create",
            default: "Create",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "phrases",
            default: "Phrases",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectPhrasesCreate />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "phrases",
          new paramMatch("phrase", ANYTHING_BUT_SLASH),
        ],
        title:
          "{$phrase} | " +
          intl.translate({
            key: "phrases",
            default: "Phrases",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectViewPhrase />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "phrases",
          new paramMatch("phrase", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "views.pages.explore.dialect.phrases.edit_x_phrase",
            default: "Edit {$phrase} Phrase",
            params: ["{$phrase}"],
          }) +
          " | " +
          intl.translate({
            key: "phrases",
            default: "Phrases",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectPhraseEdit />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "stories",
        ],
        title:
          intl.translate({
            key: "stories",
            default: "Stories",
            case: "words",
          }) + " | {$dialect_name}",
        page: (
          <PageDialectLearnStoriesAndSongs
            typeFilter="story"
            typePlural={intl.translate({
              key: "stories",
              default: "Stories",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "songs",
        ],
        title:
          intl.translate({
            key: "songs",
            default: "Songs",
            case: "words",
          }) + " | {$dialect_name}",
        page: (
          <PageDialectLearnStoriesAndSongs
            typeFilter="song"
            typePlural={intl.translate({
              key: "songs",
              default: "Songs",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "songs-stories",
        ],
        title:
          intl.translate({
            key: "songs_and_stories",
            default: "Songs and Stories",
            case: "words",
          }) + " | {$dialect_name}",
        page: (
          <PageDialectLearnStoriesAndSongs
            typePlural={intl.translate({
              key: "songs_and_stories",
              default: "Songs and Stories",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "stories",
          "create",
        ],
        title:
          intl.translate({
            key: "create",
            default: "Create",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "stories",
            default: "Stories",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectStoriesAndSongsCreate
            typeFilter="story"
            typePlural={intl.translate({
              key: "stories",
              default: "Stories",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "songs",
          "create",
        ],
        title:
          intl.translate({
            key: "create",
            default: "Create",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "songs",
            default: "Songs",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectStoriesAndSongsCreate
            typeFilter="song"
            typePlural={intl.translate({
              key: "songs",
              default: "Songs",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "songs",
          new paramMatch("bookName", ANYTHING_BUT_SLASH),
        ],
        title:
          "{$bookName} | " +
          intl.translate({
            key: "songs",
            default: "Songs",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectViewBook
            typeFilter="song"
            typePlural={intl.translate({
              key: "songs",
              default: "Songs",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "songs",
          new paramMatch("bookName", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "views.pages.explore.dialect.learn.songs_stories.edit_x_book",
            default: "Edit {$bookName} Book",
            params: ["{$bookName}"],
          }) +
          " | " +
          intl.translate({
            key: "songs",
            default: "Songs",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectBookEdit
            typeFilter="song"
            typePlural={intl.translate({
              key: "songs",
              default: "Songs",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "songs",
          new paramMatch("parentBookName", ANYTHING_BUT_SLASH),
          "create",
        ],
        title:
          intl.translate({
            key: "create_entry",
            default: "Create Entry",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "views.pages.explore.dialect.learn.songs_stories.x_book",
            default: "{$bookName} Book",
            params: ["{$bookName}"],
          }) +
          " | " +
          intl.translate({
            key: "songs",
            default: "Songs",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectStoriesAndSongsBookEntryCreate
            typeFilter="song"
            typePlural={intl.translate({
              key: "songs",
              default: "Songs",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "songs",
          new paramMatch("parentBookName", ANYTHING_BUT_SLASH),
          new paramMatch("bookName", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "edit_entry",
            default: "Edit Entry",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "views.pages.explore.dialect.learn.songs_stories.x_book",
            default: "{$bookName} Book",
            params: ["{$bookName}"],
          }) +
          " | " +
          intl.translate({
            key: "songs",
            default: "Songs",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectBookEntryEdit
            typeFilter="song"
            typePlural={intl.translate({
              key: "songs",
              default: "Songs",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "stories",
          new paramMatch("bookName", ANYTHING_BUT_SLASH),
        ],
        title:
          intl.translate({
            key: "views.pages.explore.dialect.learn.songs_stories.x_book",
            default: "{$bookName} Book",
            params: ["{$bookName}"],
          }) +
          " | " +
          intl.translate({
            key: "stories",
            default: "Stories",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectViewBook
            typeFilter="story"
            typePlural={intl.translate({
              key: "stories",
              default: "Stories",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          new paramMatch("area", WORKSPACE_OR_SECTION),
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "stories",
          new paramMatch("bookName", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "views.pages.explore.dialect.learn.songs_stories.edit_x_book",
            default: "Edit {$bookName} Book",
            params: ["{$bookName}"],
          }) +
          " | " +
          intl.translate({
            key: "stories",
            default: "Stories",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectBookEdit
            typeFilter="story"
            typePlural={intl.translate({
              key: "stories",
              default: "Stories",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "stories",
          new paramMatch("parentBookName", ANYTHING_BUT_SLASH),
          "create",
        ],
        title:
          intl.translate({
            key: "create_entry",
            default: "Create Entry",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "views.pages.explore.dialect.learn.songs_stories.x_book",
            default: "{$bookName} Book",
            params: ["{$bookName}"],
          }) +
          " | " +
          intl.translate({
            key: "stories",
            default: "Stories",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectStoriesAndSongsBookEntryCreate
            typeFilter="story"
            typePlural={intl.translate({
              key: "stories",
              default: "Stories",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "stories",
          new paramMatch("parentBookName", ANYTHING_BUT_SLASH),
          new paramMatch("bookName", ANYTHING_BUT_SLASH),
          "edit",
        ],
        title:
          intl.translate({
            key: "edit_entry",
            default: "Edit Entry",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "views.pages.explore.dialect.learn.songs_stories.x_book",
            default: "{$bookName} Book",
            params: ["{$bookName}"],
          }) +
          " | " +
          intl.translate({
            key: "stories",
            default: "Stories",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: (
          <PageDialectBookEntryEdit
            typeFilter="story"
            typePlural={intl.translate({
              key: "stories",
              default: "Stories",
              case: "words",
            })}
          />
        ),
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "categories",
          "create",
        ],
        title:
          intl.translate({
            key: "create",
            default: "Create",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "category",
            default: "Category",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectCategoryCreate />,
        extractPaths: true,
      },
      {
        path: [
          KIDS_OR_DEFAULT,
          "FV",
          "Workspaces",
          "Data",
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          ANYTHING_BUT_SLASH,
          "learn",
          "phrasebooks",
          "create",
        ],
        title:
          intl.translate({
            key: "create",
            default: "Create",
            case: "words",
          }) +
          " | " +
          intl.translate({
            key: "phrase_book",
            default: "Phrase Book",
            case: "words",
          }) +
          " | {$dialect_name}",
        page: <PageDialectPhraseBooksCreate />,
      },
      {
        path: "404-page-not-found",
        title: PAGE_NOT_FOUND_TITLE,
        page: <PageError title={PAGE_NOT_FOUND_TITLE} body={PAGE_NOT_FOUND_BODY} />,
      },
    ])

    return {
      routes: routes,
      matchedPage: null,
      matchedRouteParams: {},
      warningsDismissed: false,
    }
  }

  /**
   * Dynamically update title
   */
  _updateTitle() {
    // Title provided from within a component
    const pageTitleParams = this.props.properties.pageTitleParams

    let title = this.props.properties.title

    if (
      this.state.matchedPage &&
      this.state.matchedPage.has("title") &&
      this.state.matchedPage.get("title") &&
      this.state.matchedPage.get("title") !== document.title
    ) {
      const combinedRouteParams = Object.assign({}, this.state.matchedRouteParams, pageTitleParams)

      title = this.state.matchedPage.get("title")
      Object.keys(combinedRouteParams).forEach((route) => {
        title = title.replace("{$" + route + "}", StringHelpers.toTitleCase(combinedRouteParams[route]))
      })

      title = title + " | " + this.props.properties.title
    }

    if (title.search(" | ") >= 0) {
      const newTitle = []

      const parts = title.split("|")

      let i
      for (i in parts) {
        newTitle.push(intl.searchAndReplace(parts[i].trim()))
      }
      title = newTitle.join(" | ")
    }

    document.title = title
  }

  /**
   * Conditionally route the parameters.
   * This could normally go into the render method to keep things simple,
   * however redirecting (i.e. updating state), cannot be done inside render.
   */
  _route(props, routesOverride = null) {
    let matchedPage = null
    let matchedRouteParams = {}

    const pathArray = props.splitWindowPath

    const routes = routesOverride || this.state.routes

    routes.forEach((value) => {
      const matchTest = this._matchPath(value.get("path"), pathArray)
      const matchAlias = this._matchPath(value.get("alias"), pathArray)

      // If only the alias matched, redirect to the original path
      if (matchAlias.matched && !matchTest.matched) {
        window.location.replace("/" + value.get("path").join())
      }

      if (matchTest.matched) {
        const routeParams = matchTest.routeParams

        // Extract common paths from URL
        if (value.has("extractPaths") && value.get("extractPaths")) {
          if (pathArray.length >= 7) {
            routeParams.dialect_name = decodeURI(pathArray.slice(1, 7)[5])
            routeParams.dialect_path = decodeURI("/" + pathArray.slice(1, 7).join("/"))
          }

          if (pathArray.length >= 6) {
            routeParams.language_name = decodeURI(pathArray.slice(1, 6)[4])
            routeParams.language_path = decodeURI("/" + pathArray.slice(1, 6).join("/"))
          }

          if (pathArray.length >= 5) {
            routeParams.language_family_name = decodeURI(pathArray.slice(1, 5)[3])
            routeParams.language_family_path = decodeURI("/" + pathArray.slice(1, 5).join("/"))
          }
        }

        matchedPage = value
        matchedRouteParams = routeParams

        // Break out of forEach
        return false
      }
    })

    // Match found
    if (matchedPage !== null) {
      // Redirect if required
      if (matchedPage.has("redirects")) {
        matchedPage.get("redirects").forEach((value) => {
          if (value.get("condition")({ props: props })) {
            // Avoid invariant violations during rendering by setting temporary placeholder component as matched page, and 'redirecting' after mount.
            matchedPage = matchedPage.set(
              "page",
              Immutable.fromJS(
                React.createElement(
                  Redirecter,
                  {
                    redirect: () => {
                      return props.replaceWindowPath(value.get("target")({ props: props }))
                    },
                  },
                  matchedPage.get("page")
                )
              )
            )

            return false
          }
        })
      }

      // Switch themes based on route params
      if (matchedRouteParams.hasOwnProperty("theme")) {
        let newTheme = matchedRouteParams.theme

        // Switch to workspace theme if available
        if (
          ((matchedRouteParams.hasOwnProperty("area") && matchedRouteParams.area === "Workspaces") ||
            matchedPage.get("path").indexOf("Workspaces") !== -1) &&
          matchedRouteParams.theme === "explore"
        ) {
          newTheme = "workspace"
        }

        if (props.properties.theme.id != newTheme) {
          props.changeTheme(newTheme)
        }
      } else {
        props.changeTheme("default")
      }

      const matchReturn = {
        matchedPage: matchedPage,
        matchedRouteParams: matchedRouteParams,
      }

      // Load help
      //props.loadGuide(props.windowPath, matchReturn);

      // Load Navigation
      //props.loadNavigation();

      this.setState(matchReturn)
    } else {
      // No match found (i.e. 404)
      const notFoundPage = Immutable.fromJS({
        title: PAGE_NOT_FOUND_TITLE,
        page: <PageError title={PAGE_NOT_FOUND_TITLE} body={PAGE_NOT_FOUND_BODY} />,
      })

      const matchReturn = {
        matchedPage: notFoundPage,
        matchedRouteParams: matchedRouteParams,
      }

      this.setState(matchReturn)
    }
  }

  componentWillMount() {
    this._route(this.props)
  }

  componentDidUpdate(prevProps) {
    this._updateTitle()

    if (prevProps.windowPath !== this.props.windowPath) {
      // Track page view
      if (window.snowplow) {
        window.snowplow("trackPageView")
      }
    }

    if (selectn("computeLogin.isConnected", this.props) && selectn("computeLogin.isNewLogin", this.props)) {
      let primary_dialect_path = selectn("primary_dialect_path", this.props.preferences)

      if (primary_dialect_path && prevProps.preferences.primary_dialect_path === undefined) {
        primary_dialect_path = "/explore" + primary_dialect_path
        this.props.pushWindowPath(primary_dialect_path)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const primary_dialect_path = selectn("primary_dialect_path", this.props.preferences)
    const next_primary_dialect_path = selectn("primary_dialect_path", nextProps.preferences)

    // Re-route on window path change
    if (nextProps.windowPath !== this.props.windowPath) {
      this._route(nextProps)
    } else if (nextProps.computeLogin != this.props.computeLogin) {
      // Re-route on login
      this._route(nextProps)
    } else if (
      // Re-route if preferences change
      next_primary_dialect_path !== undefined &&
      next_primary_dialect_path != primary_dialect_path &&
      next_primary_dialect_path.length > 0
    ) {
      this._route(nextProps)
    }
    // Re-route if trying to view Workspaces from different group
    // TODO: Handle on back-end; hide all areas where you can access workspaces
    else if (
      ProviderHelpers.isDialectPath(nextProps.windowPath) &&
      allowedToAccessWorkspaces(nextProps.windowPath, nextProps.computeLogin, nextProps.computeDialect2)
    ) {
      window.location.href = nextProps.windowPath.replace("Workspaces", "sections")
    }
  }

  _renderBreadcrumb(matchedPage, routeParams) {
    const props = this.props
    let splitPath = props.splitWindowPath
    const routes = this.state.routes

    const breadcrumbPathOverride = matchedPage.get("breadcrumbPathOverride")

    if (breadcrumbPathOverride) {
      splitPath = breadcrumbPathOverride(splitPath)
    }

    const breadcrumb = splitPath.map((path, index) => {
      if (path && path != "" && REMOVE_FROM_BREADCRUMBS.indexOf(path) === -1) {
        let pathTitle = path

        if (this.props.properties.breadcrumbs != null) {
          pathTitle = path.replace(
            this.props.properties.breadcrumbs.find,
            selectn(this.props.properties.breadcrumbs.replace, this.props.properties)
          )
        }

        // Last element (i.e. current page)
        if (index == splitPath.length - 1) {
          return (
            <li key={index} className="active">
              {decodeURIComponent(pathTitle)}
            </li>
          )
        }
        let hrefPath = "/" + splitPath.slice(0, index + 1).join("/")

        /**
         * Replace breadcrumb entry with redirect value. Solved some rendering issues. Needs more robust solution though.
         */
        routes.forEach((value) => {
          const matchTest = this._matchPath(value.get("path"), [path])

          if (matchTest.matched) {
            if (value.has("redirects")) {
              value.get("redirects").forEach((redirectValue) => {
                if (redirectValue.get("condition")({ props: props })) {
                  hrefPath = redirectValue.get("target")({ props: props })
                  hrefPath = hrefPath.replace("sections", routeParams.area || splitPath[2] || "sections")

                  return false
                }
              })
            }

            // Break out of forEach
            return false
          }
        })

        return (
          <li key={index}>
            <Link key={index} href={hrefPath}>
              {intl.searchAndReplace(decodeURIComponent(pathTitle).replace("&amp;", "&"))}
            </Link>
          </li>
        )
      }
    })

    return breadcrumb
  }

  _renderWithBreadcrumb(reactElement, matchedPage, props, theme) {
    const themePalette = props.properties.theme.palette.rawTheme.palette

    return (
      <div>
        <div className="breadcrumbContainer row">
          <div className="clearfix" style={{ backgroundColor: themePalette.accent4Color }}>
            {(() => {
              const area = selectn("routeParams.area", reactElement.props)

              if (
                area &&
                selectn("isConnected", props.computeLogin) &&
                matchedPage.get("disableWorkspaceSectionNav") !== true &&
                !ProviderHelpers.isSiteMember(selectn("response.properties.groups", props.computeLogin))
              ) {
                return <WorkspaceSwitcher area={area} />
              }
            })()}

            <ol className={classNames("breadcrumb", "pull-left", "fontAboriginalSans")}>
              <li>
                <Link href="/">
                  {intl.translate({
                    key: "home",
                    default: "Home",
                    case: "words",
                  })}
                </Link>
              </li>
              {this._renderBreadcrumb(matchedPage, reactElement.props.routeParams)}
            </ol>
          </div>
        </div>

        <div className={"page-" + theme + "-theme"}>{reactElement}</div>
      </div>
    )
  }

  /**
   * Tests to see if current URL matches route.
   * Return object with matched boolean and route params returned
   */
  _matchPath(pathMatchArray, urlPath) {
    // Remove empties from path array, return Immutable list
    const currentPathArray = Immutable.fromJS(
      urlPath.filter((e) => {
        return e
      })
    )

    if (!pathMatchArray) {
      return false
    }

    if (pathMatchArray.size != currentPathArray.size) {
      return { matched: false, routeParams: {} }
    }

    const matchedRouteParams = {}

    const matched = pathMatchArray.every((value, key) => {
      if (value instanceof RegExp) {
        return value.test(currentPathArray.get(key))
      } else if (value instanceof paramMatch) {
        if (value.hasOwnProperty("matcher")) {
          const testMatch = value.matcher.test(currentPathArray.get(key))

          if (testMatch) {
            matchedRouteParams[value.id] = decodeURI(currentPathArray.get(key))
            return true
          }
        }

        return false
      }
      return value === currentPathArray.get(key)
    })

    return { matched: matched, routeParams: matchedRouteParams }
  }

  render() {
    const { matchedPage, matchedRouteParams } = this.state

    const isFrontPage = !matchedPage ? false : matchedPage.get("frontpage")
    const hideNavigation = matchedPage && matchedPage.has("navigation") && matchedPage.get("navigation") === false

    let page

    let navigation = <Navigation frontpage={isFrontPage} routeParams={matchedRouteParams} />
    const theme = matchedRouteParams.hasOwnProperty("theme") ? matchedRouteParams.theme : "default"
    const print = matchedPage
      ? matchedPage
          .get("page")
          .get("props")
          .get("print") === true
      : false

    let footer = <Footer className={"footer-" + theme + "-theme"} />

    const clonedElement = React.cloneElement(matchedPage.get("page").toJS(), { routeParams: matchedRouteParams })

    // For print view return page only
    if (print) {
      return <div style={{ margin: "25px" }}>{clonedElement}</div>
    }

    // Remove breadcrumbs for Kids portal
    // TODO: Make more generic if additional themes are added in the future.
    if (theme == "kids") {
      page = clonedElement
      navigation = <KidsNavigation frontpage={isFrontPage} routeParams={matchedRouteParams} />
    } else {
      // Without breadcrumbs
      if (matchedPage.get("breadcrumbs") === false) {
        page = clonedElement
      } else {
        // With breadcrumbs
        page = this._renderWithBreadcrumb(clonedElement, matchedPage, this.props, theme)
      }
    }

    // Hide navigation
    if (hideNavigation) {
      navigation = footer = ""
    }

    return (
      <div>
        {(matchedPage && matchedPage.hasOwnProperty("warnings") ? matchedPage.get("warnings") : []).map((warning) => {
          if (this.props.warnings.hasOwnProperty(warning) && !this.state.warningsDismissed) {
            return (
              <div
                style={{ position: "fixed", bottom: 0, zIndex: 99999 }}
                className={classNames("alert", "alert-warning")}
              >
                {selectn(warning, this.props.warnings)}
                <FlatButton
                  label={intl.translate({
                    key: "dismiss",
                    default: "Dismiss",
                    case: "words",
                  })}
                  onTouchTap={() => this.setState({ warningsDismissed: true })}
                />
              </div>
            )
          }
        })}

        <div id="pageNavigation" className="row">
          {navigation}
        </div>
        <div id="pageContainer">{page}</div>
        <div id="pageFooter" className="row">
          {footer}
        </div>
      </div>
    )
  }
}

/* globals ENV_CONTEXT_PATH */
const CONTEXT_PATH = ENV_CONTEXT_PATH !== null && typeof ENV_CONTEXT_PATH !== 'undefined' ? ENV_CONTEXT_PATH : ''

module.exports = {
  title: 'FirstVoices',
  domain: 'FV',
  apiURL: 'https://api.firstvoices.com/v1/',
  contextPath: CONTEXT_PATH,
  testData: {
    sectionOrWorkspaces: '/FV/Workspaces/Data/',
    languageFamilyPath: 'MyTestLanguage',
    languagePath: 'MyTestLanguage/MyTestLanguage',
    dialectPath: 'MyTestLanguage/MyTestLanguage/Test444',
    dialect: {
      'fvdialect:short_url': 'test_444_short_url',
    },
    word: {
      name: 'C̸ÁNET',
      properties: {
        'dc:title': 'test',
        'fv:definitions': {
          translation: 'take it',
          language: 'english',
        },
        'fv-word:part_of_speech': 'noun',
      },
    },
  },
  preferences: {
    fields: {
      start_page: {
        my_dialect: 'My Portal (default)',
        my_kids_dialect: 'My Kids Portal',
        home: 'Home Page',
        all_dialects: 'All Dialects',
        contribute: 'Contribute',
        kids: 'Kids Portal Home',
      },
      font_size: {
        default: 'Default',
        larger: 'Larger',
      },
    },
    values: {
      start_page: {
        my_dialect: 'my_dialect',
        my_kids_dialect: 'my_kids_dialect',
        home: '/',
        all_dialects: '/explore/FV/Workspaces/Data/',
        contribute: '/contribute',
        kids: '/kids',
      },
      font_size: {
        default: '1em',
        larger: '1.4em',
      },
    },
  },
}

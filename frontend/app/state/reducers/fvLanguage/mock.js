import ConfGlobal from 'common/conf/local.js'

export const mockRequest = {
  fetchLanguage: {
    // args PathOrId + type of document
    args: [ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.languagePath, 'FVLanguage'],
    evaluateResults: (response) => {
      return response.type === 'FVLanguage' && response.properties != null
    },
  },
  fetchLanguages: {
    // args PathOrId + type of document
    args: [ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.languageFamilyPath, 'FVLanguage'],
    evaluateResults: (response) => {
      return response.totalSize > 0
    },
  },
}

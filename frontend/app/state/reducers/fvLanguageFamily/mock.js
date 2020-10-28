import ConfGlobal from 'common/conf/local.js'

export const mockRequest = {
  fetchLanguageFamily: {
    // args PathOrId + type of document
    args: [ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.languageFamilyPath, 'FVLanguageFamily'],
    evaluateResults: (response) => {
      return response.type === 'FVLanguageFamily' && response.properties != null
    },
  },
}

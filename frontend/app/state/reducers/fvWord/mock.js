import ConfGlobal from 'common/conf/local.js'

export const mockRequest = {
  createWord: {
    // args PathOrId + type of document
    args: [
      ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.dialectPath + '/Dictionary',
      {
        type: 'FVWord',
        name: ConfGlobal.testData.word.name + Date.now().toString(),
        properties: ConfGlobal.testData.word.properties,
      },
    ],
    evaluateResults: (response) => {
      return response.type === 'FVDialect' && response.properties != null
    },
  },
}

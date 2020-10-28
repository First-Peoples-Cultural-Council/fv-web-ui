export const mock = {
  queryPage: {
    // args PathOrId + type of document
    args: ['/FV/sections/Site/Resources/', 'FVPage', " AND fvpage:url LIKE '/home/'&sortOrder=ASC&sortBy=dc:title"],
    evaluateResults: (response) => {
      return response.entries.length === 1 && response.entries[0].properties != null
    },
  },
}

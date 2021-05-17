const wordDefaultCols = ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'state']
const phraseDefaultCols = ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'state']
export const reportsQueries = [
  {
    name: 'Words Visible to Team Only',
    type: 'words',
    query:
      " AND ecm:primaryType='FVWord' AND (ecm:currentLifeCycleState='New' OR ecm:currentLifeCycleState='Disabled')",
    cols: ['title', 'related_pictures', 'related_audio', 'fv:definitions', 'fv-word:part_of_speech'],
  },
  {
    name: 'Words Visible to Members Only',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Enabled'",
    cols: ['title', 'related_pictures', 'related_audio', 'fv:definitions', 'fv-word:part_of_speech'],
  },
  {
    name: 'Words Visible to the Public',
    type: 'words',
    query:
      " AND ecm:primaryType='FVWord' AND (ecm:currentLifeCycleState='Published' OR ecm:currentLifeCycleState='Republished')",
    cols: ['title', 'related_pictures', 'related_audio', 'fv:definitions', 'fv-word:part_of_speech'],
  },
  {
    name: 'Words without Audio',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv:related_audio/* IS NULL",
    cols: wordDefaultCols,
  },
  {
    name: 'Words with Audio',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv:related_audio/* IS NOT NULL",
    cols: wordDefaultCols,
  },
  {
    name: 'Words without Pictures',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv:related_pictures/* IS NULL",
    cols: wordDefaultCols,
  },
  {
    name: 'Words without Videos',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv:related_videos/* IS NULL",
    cols: wordDefaultCols,
  },
  {
    name: 'Words without Source',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv:source/* IS NULL",
    cols: wordDefaultCols,
  },
  {
    name: 'Words without Categories',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv-word:categories/* IS NULL",
    cols: wordDefaultCols,
  },
  {
    name: 'Words without Part of Speech',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv-word:part_of_speech IS NULL",
    cols: wordDefaultCols,
  },
  {
    name: 'Words without Pronunciation',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv-word:pronunciation IS NULL",
    cols: wordDefaultCols,
  },
  {
    name: 'Words without Related Phrases',
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv-word:related_phrases/* IS NULL",
    cols: wordDefaultCols,
  },
  {
    name: "Words included in Kid's Archive",
    type: 'words',
    query: " AND ecm:primaryType='FVWord' AND fv:available_in_childrens_archive=1",
    cols: wordDefaultCols,
  },
  {
    name: 'Words included in Games',
    type: 'words',
    query:
      " AND ecm:primaryType='FVWord' AND fv:related_pictures/* IS NOT NULL AND fv:related_audio/* IS NOT NULL AND fv:available_in_childrens_archive=1",
    cols: wordDefaultCols,
  },
  {
    name: 'Words recently modified',
    type: 'words',
    query: " AND ecm:primaryType='FVWord'",
    cols: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'dc:modified'],
    sortBy: 'dc:modified',
    sortOrder: 'desc',
  },
  {
    name: 'Words recently created',
    type: 'words',
    query: " AND ecm:primaryType='FVWord'",
    cols: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'dc:created'],
    sortBy: 'dc:created',
    sortOrder: 'desc',
  },
  {
    name: 'Phrases Visible to Team Only',
    type: 'phrases',
    query:
      " AND ecm:primaryType='FVPhrase' AND (ecm:currentLifeCycleState='New' OR ecm:currentLifeCycleState='Disabled')",
    cols: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'fv-phrase:phrase_books'],
  },
  {
    name: 'Phrases Visible to Members Only',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='Enabled'",
    cols: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'fv-phrase:phrase_books'],
  },
  {
    name: 'Phrases Visible to the Public',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND ecm:currentLifeCycleState='Published'",
    cols: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'fv-phrase:phrase_books'],
  },
  {
    name: 'Phrases without Audio',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND fv:related_audio/* IS NULL",
    cols: phraseDefaultCols,
  },
  {
    name: 'Phrases with Audio',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND fv:related_audio/* IS NOT NULL",
    cols: phraseDefaultCols,
  },
  {
    name: 'Phrases without Pictures',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND fv:related_pictures/* IS NULL",
    cols: phraseDefaultCols,
  },
  {
    name: 'Phrases without Videos',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND fv:related_videos/* IS NULL",
    cols: phraseDefaultCols,
  },
  {
    name: 'Phrases without Source',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND fv:source/* IS NULL",
    cols: phraseDefaultCols,
  },
  {
    name: 'Phrases without Phrasebooks',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND fv-phrase:phrase_books/* IS NULL",
    cols: phraseDefaultCols,
  },
  {
    name: "Phrases included in Kid's Archive",
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase' AND fv:available_in_childrens_archive=1",
    cols: phraseDefaultCols,
  },
  {
    name: 'Phrases recently modified',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase'",
    cols: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'dc:modified'],
    sortBy: 'dc:modified',
    sortOrder: 'desc',
  },
  {
    name: 'Phrases recently created',
    type: 'phrases',
    query: " AND ecm:primaryType='FVPhrase'",
    cols: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'dc:created'],
    sortBy: 'dc:created',
    sortOrder: 'desc',
  },
]

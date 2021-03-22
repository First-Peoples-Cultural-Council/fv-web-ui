import useSearchParams from 'common/useSearchParams'

describe('useSearchParams', () => {
  test('works', () => {
    const output = useSearchParams({
      defaultValues: {
        addExtraQuery: 'NoProblem',
      },
      decode: [
        {
          name: 'dialectName',
          type: 'uri',
        },
        {
          name: 'isFalse',
          type: 'bool',
        },
        {
          name: 'isTrue',
          type: 'bool',
        },
        {
          name: 'page',
          type: 'numb',
        },
        {
          name: 'pageSize',
          type: 'numb',
        },
      ],
    })
    expect(output).toStrictEqual({
      addExtraQuery: 'NoProblem',
      isFalse: false,
      isTrue: true,
      letter: 'ɫ',
      page: 1,
      pageSize: 10,
      searchTerm: 'Haíɫzaqvḷa',
    })
  })
})

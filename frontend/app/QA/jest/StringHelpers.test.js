import StringHelpers, { CLEAN_NXQL, CLEAN_FULLTEXT, CLEAN_ID } from 'common/StringHelpers'

// Let us begin!
// ==================================================
describe('StringHelpers', () => {
  test('clean', () => {
    const testStr = 'A@B\'C:D"E()F!G&H[]I/JK#'
    const testStrEncodeComponent = encodeURIComponent(testStr)
    const testStrEncodeURI = encodeURI(testStr)
    expect(StringHelpers.clean(testStr, CLEAN_NXQL)).toBe('A@B\\\'C:D"E()F!G%26H\\[\\]I/JK#')
    expect(StringHelpers.clean(testStrEncodeComponent, CLEAN_NXQL)).toBe('A@B\\\'C:D"E()F!G%26H\\[\\]I/JK#')
    expect(StringHelpers.clean(testStrEncodeURI, CLEAN_NXQL)).toBe('A@B\\\'C:D"E()F!G%26H\\[\\]I/JK#')

    expect(StringHelpers.clean(testStr, CLEAN_FULLTEXT)).toBe('A@B\\\'C\\:D\\"EF\\!G&H[]I/JK#')
    expect(StringHelpers.clean(testStrEncodeComponent, CLEAN_FULLTEXT)).toBe('A@B\\\'C:D"EF\\!G&H[]I/JK#')
    expect(StringHelpers.clean(testStrEncodeURI, CLEAN_FULLTEXT)).toBe('A@B\\\'C\\:D"EF\\!G&H[]I/JK#')

    expect(StringHelpers.clean(testStr, CLEAN_ID)).toBe('A@B\'C-D"E()F!G&HI/JK#')
    expect(StringHelpers.clean(testStrEncodeComponent, CLEAN_ID)).toBe("A%40B'C%3AD%22E()F!G%26H%5B%5DI%2FJK%23")
    expect(StringHelpers.clean(testStrEncodeURI, CLEAN_ID)).toBe("A@B'C-D%22E()F!G&H%5B%5DI/JK#")
  })
})

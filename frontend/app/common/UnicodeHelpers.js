/*
const basicMultiPlane = 'a';
const surrogatePairs = '😀';
const combiningMarks = 'å';
const newUnicode = 'ᖁ';
const confusableUnicode = 'ᕐd';

getLiteralUnicodeValues(basicMultiPlane) // returns '\\u0061'
getLiteralUnicodeValues(surrogatePairs) // returns '\\ud83d\\ude00'
getLiteralUnicodeValues(combiningMarks) // returns '\\u00e5'
getLiteralUnicodeValues(newUnicode) // returns '\\u1581'
getLiteralUnicodeValues(confusableUnicode) // returns '\\u1550\\u0064'
*/
export const getLiteralUnicodeValues = (char) => {
  return char
    .split('')
    .map((value) => {
      let temp = value.charCodeAt(0).toString(16)
      const diff = 4 - temp.length
      let i = 0
      for (i; i < diff; i += 1) {
        temp = `0${temp}`
      }
      return `\\u${temp}`
    })
    .join('')
}

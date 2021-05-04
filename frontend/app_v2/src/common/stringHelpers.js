export const localDateMDYT = (dateString) => {
  const d = new Date(dateString)
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  let hours = d.getHours()
  let minutes = d.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  const strTime = hours + ':' + minutes + ' ' + ampm

  return m[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + strTime
}
export const localDateMDY = (dateString) => {
  const d = new Date(dateString)
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}/${d.getFullYear()}`
}

export const getFriendlyDocType = (FVType) => {
  switch (FVType) {
    case 'FVWord':
      return 'word'
    case 'FVPhrase':
      return 'phrase'
    case 'FVBook':
      return 'song/story'
    default:
      return ''
  }
}

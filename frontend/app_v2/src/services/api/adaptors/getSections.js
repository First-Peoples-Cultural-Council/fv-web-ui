const getSections = (response) => {
  const { title, uid, path, logoId: idLogo } = response

  return {
    title,
    uid,
    path,
    idLogo,
  }
}
export default getSections

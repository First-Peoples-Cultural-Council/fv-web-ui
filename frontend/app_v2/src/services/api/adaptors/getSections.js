const getSections = (response) => {
  const { title, uid, path, logoId: idLogo } = response

  return {
    title,
    uid,
    path,
    idLogo,
    logoUrl: `/nuxeo/nxpicsfile/default/${idLogo}/Small:content/`,
  }
}
export default getSections

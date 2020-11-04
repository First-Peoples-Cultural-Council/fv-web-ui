import DOMPurify from 'dompurify'

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'iframe') {
    const src = node.getAttribute('src') || ''
    if (!src.startsWith('https://www.youtube.com/embed/')) {
      return node.parentNode?.removeChild(node)
    }
  }
})
const Sanitize = (content) => {
  return DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  })
}
export default Sanitize

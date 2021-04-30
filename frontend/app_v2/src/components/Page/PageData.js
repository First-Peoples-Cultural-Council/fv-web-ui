import React from 'react'

import { getMediaUrl } from 'common/urlHelpers'
import HeroBackground from 'images/hero-background.jpg'
import useGetSite from 'common/useGetSite'
/**
 * @summary PageData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function PageData() {
  const { title, logoId } = useGetSite()
  const logoUrl = getMediaUrl({ type: 'image', id: logoId, viewName: 'Small' })
  return {
    hero: {
      background: HeroBackground,
      foreground: title ? title : '',
      foregroundIcon: logoUrl ? logoUrl : '',
    },
    content: {
      heading: `${title} peoples`,
      body: (
        <>
          <p>
            Eiusmod reprehenderit magna laboris do non do do dolore aute ex. Duis dolore sunt non cupidatat duis
            cupidatat deserunt laboris id amet aliquip velit duis eu. Duis commodo consequat ea irure ea ipsum consequat
            consectetur do sunt mollit. Id non laborum Lorem fugiat do. Magna aliqua pariatur voluptate qui tempor sit
            magna aute ut officia laboris. Incididunt eiusmod reprehenderit ullamco dolor est irure ex.
          </p>

          <h2>Heading</h2>

          <p>
            Adipisicing tempor sit enim non. Duis sit aliquip ipsum qui enim reprehenderit minim pariatur veniam ea esse
            nisi ullamco. Eu ullamco sint minim aliquip in excepteur et do anim culpa dolore commodo.
          </p>

          <p>
            Sunt ea eiusmod est ipsum enim officia deserunt amet consectetur occaecat tempor esse. Enim id commodo
            veniam culpa occaecat Lorem enim culpa ex sunt irure deserunt ea. Cupidatat fugiat Lorem dolor consectetur
            aute excepteur mollit et sit officia magna duis fugiat anim.
          </p>

          <p>
            Ut minim dolor eu minim ipsum enim eu sit consectetur labore cillum. Nulla ad incididunt veniam proident
            dolore labore excepteur velit fugiat. Velit sint culpa qui elit culpa incididunt cillum consectetur cillum.
            Nisi elit proident elit ut amet sit fugiat consequat eu ullamco ut. Mollit minim ad proident cillum. In id
            elit officia sunt non cupidatat laborum quis et minim est.
          </p>

          <p>
            Culpa eiusmod Lorem consectetur sunt anim laborum nisi fugiat. Lorem deserunt incididunt labore non duis.
            Mollit aliquip pariatur eu ad sunt.
          </p>
        </>
      ),
    },
  }
}
// PROPTYPES
// const { func } = PropTypes
// PageData.propTypes = {
//   children: func,
// }

export default PageData

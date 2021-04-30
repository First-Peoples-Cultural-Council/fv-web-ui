import React from 'react'
import PropTypes from 'prop-types'

import useGetSite from 'common/useGetSite'

/**
 * @summary ResourceData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ResourceData({ resourceId }) {
  const { title } = useGetSite()

  return {
    content: {
      bannerHeading:
        resourceId === 'apps' ? `Download the ${title} Dictionary App!` : `Download Keyboards for ${title}!`,
      heading: resourceId === 'apps' ? 'Our Apps' : 'Our Keyboards',
      body: [
        {
          sectionHeading: 'Overview',
          sectionText: (
            <>
              <p>
                Eiusmod reprehenderit magna laboris do non do do dolore aute ex. Duis dolore sunt non cupidatat duis
                cupidatat deserunt laboris id amet aliquip velit duis eu. Duis commodo consequat ea irure ea ipsum
                consequat consectetur do sunt mollit. <strong>{title}</strong> Id non laborum Lorem fugiat do. Magna
                aliqua pariatur voluptate qui tempor sit magna aute ut officia laboris. Incididunt eiusmod reprehenderit
                ullamco dolor est irure ex.
              </p>
            </>
          ),
        },
        {
          sectionHeading: 'Installation Instructions for iOS',
          sectionText: (
            <>
              <p>
                Sunt ea eiusmod est ipsum enim officia deserunt amet consectetur occaecat tempor esse. Enim id commodo
                veniam <strong>{title}</strong> occaecat Lorem enim culpa ex sunt irure deserunt ea. Cupidatat fugiat
                Lorem dolor consectetur aute excepteur mollit et sit officia magna duis fugiat anim.
              </p>
            </>
          ),
        },
        {
          sectionHeading: 'Installation Instructions for Android',
          sectionText: (
            <>
              <p>
                Sunt ea eiusmod est ipsum enim officia deserunt amet consectetur occaecat tempor esse. Enim id commodo
                veniam <strong>{title}</strong> occaecat Lorem enim culpa ex sunt irure deserunt ea. Cupidatat fugiat
                Lorem dolor consectetur aute excepteur mollit et sit officia magna duis fugiat anim.
              </p>
            </>
          ),
        },
        {
          sectionHeading: 'Videos',
          sectionText: (
            <>
              <p className="lg:flex lg:space-x-4">
                <iframe
                  className="w-full"
                  height="315"
                  src="https://www.youtube-nocookie.com/embed/J46sRuj99Cw"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <br />
                <iframe
                  className="w-full"
                  height="315"
                  src="https://www.youtube-nocookie.com/embed/J46sRuj99Cw"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <br />
                <iframe
                  className="w-full"
                  height="315"
                  src="https://www.youtube-nocookie.com/embed/J46sRuj99Cw"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <br />
              </p>
            </>
          ),
        },
        {
          sectionHeading: 'Support',
          sectionText: (
            <>
              <p>
                Sunt ea eiusmod est ipsum enim officia deserunt amet consectetur occaecat tempor esse. Enim id commodo
                veniam <strong>{title}</strong> occaecat Lorem enim culpa ex sunt irure deserunt ea. Cupidatat fugiat
                Lorem dolor consectetur aute excepteur mollit et sit officia magna duis fugiat anim.
              </p>
            </>
          ),
        },
      ],
    },
  }
}
// PROPTYPES
const { string } = PropTypes
ResourceData.propTypes = {
  resourceId: string,
}

export default ResourceData

import React from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
import Share from 'components/Share'
/**
 * @summary WidgetWotdPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WidgetWotdPresentation({ entry }) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="m-12 text-4xl text-fv-blue font-bold tracking-wide uppercase sm:text-5xl">Word of the Day</h2>
        <p className="mt-2 text-4xl leading-8 font-bold tracking-tight text-black sm:text-5xl">
          {entry.title}
          {useIcon('Resources', 'ml-4 h-10 w-10 inline')}
        </p>
        <p className="mt-4 max-w-2xl text-2xl text-gray-500 md:mx-auto sm:text-3xl">{entry.definition}</p>
        <h3 className="mt-4 max-w-2xl text-2xl text-fv-red md:mx-auto sm:text-3xl">Share on:</h3>
        <Share.Container
          url={
            'https://www.firstvoices.com/explore/FV/sections/Data/Athabascan/Yekooche/Yekooche/learn/words/167adc92-020c-4fa8-94a3-3cdf18ac05ae'
          }
          title={'Tester'}
        />
      </div>
    </section>
  )
}
// PROPTYPES
const { object } = PropTypes
WidgetWotdPresentation.propTypes = {
  entry: object,
}

export default WidgetWotdPresentation

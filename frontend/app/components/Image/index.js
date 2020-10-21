// import Image from 'components/Image'
import React from 'react'
import PropTypes from 'prop-types'
const { string } = PropTypes

export default class Image extends React.Component {
  static propTypes = {
    className: string,
    srcSet: string,
    sizes: string,
    src: string.isRequired,
    alt: string.isRequired,
  }
  static defaultProps = {
    className: '',
    srcSet: '', // eg: 'elva-fairy-320w.jpg 320w, elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w',
    sizes: '', // eg: '(max-width: 320px) 280px, (max-width: 480px) 440px, 800px',
    src: '', // eg: 'elva-fairy-800w.jpg',
    alt: '', // eg: 'Elva dressed as a fairy',
  }

  render() {
    const { className, srcSet, sizes, src, alt } = this.props
    return <img className={`${className} Image`} srcSet={srcSet} sizes={sizes} src={src} alt={alt} />
  }
}

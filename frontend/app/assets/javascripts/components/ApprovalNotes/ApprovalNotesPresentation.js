import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./ApprovalNotes.css'
/**
 * @summary ApprovalNotesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ApprovalNotesPresentation({ className }) {
  return (
    <div className={`ApprovalNotes ${className ? className : ''}`}>
      <h2>Notes</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Elit ut aliquam purus sit amet. Id leo in vitae turpis massa sed. Accumsan tortor posuere ac ut
        consequat semper viverra nam. Sociis natoque penatibus et magnis dis parturient montes nascetur.
      </p>
      <p>
        Maecenas accumsan lacus vel facilisis volutpat est. Laoreet suspendisse interdum consectetur libero id faucibus
        nisl tincidunt. Egestas diam in arcu cursus euismod quis. Pharetra massa massa ultricies mi quis hendrerit dolor
        magna. Lorem ipsum dolor sit amet.
      </p>
      <p>
        Arcu cursus vitae congue mauris rhoncus. Ut ornare lectus sit amet est. Mi eget mauris pharetra et ultrices
        neque ornare. Eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper. Ipsum dolor sit amet consectetur
        adipiscing elit ut. Elementum nibh tellus molestie nunc non blandit.
      </p>
    </div>
  )
}
// PROPTYPES
const { string } = PropTypes
ApprovalNotesPresentation.propTypes = {
  className: string,
}

export default ApprovalNotesPresentation

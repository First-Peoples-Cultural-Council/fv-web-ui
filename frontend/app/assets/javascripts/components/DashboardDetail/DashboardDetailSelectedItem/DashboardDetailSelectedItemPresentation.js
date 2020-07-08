import React from 'react'
// import PropTypes from 'prop-types'
import DashboardDetailListItem from 'components/DashboardDetail/DashboardDetailListItem'
import DashboardDetailIcon from 'components/DashboardDetail/DashboardDetailIcon'
import '!style-loader!css-loader!./DashboardDetailSelectedItem.css'

/**
 * @summary DashboardDetailSelectedItemPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DashboardDetailSelectedItemPresentation() {
  return (
    <div className="DashboardDetailSelectedItem">
      <div className="DashboardDetailSelectedItem__ItemOverview">
        <div className="DashboardDetailSelectedItem__TaskSummary">
          <DashboardDetailListItem.Presentation
            component="div"
            title={'title'}
            requestedBy={'requestedBy'}
            date={'date'}
            icon={<DashboardDetailIcon.Presentation />}
          />
        </div>
        <div className="DashboardDetailSelectedItem__ActivityStream">
          <h2>ActivityStream</h2>
          <p>Lorem ipsum dolor sit amet</p>
          <p>consectetur adipiscing elit</p>
          <p>sed do eiusmod tempor incididunt ut labore</p>
          <p>et dolore magna aliqua. Elit ut aliquam purus</p>
          <p>sit amet. Id leo in vitae turpis massa sed</p>
        </div>
        <div className="DashboardDetailSelectedItem__Notes">
          <h2>Notes</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Elit ut aliquam purus sit amet. Id leo in vitae turpis massa sed. Accumsan tortor
            posuere ac ut consequat semper viverra nam. Sociis natoque penatibus et magnis dis parturient montes
            nascetur.
          </p>
          <p>
            Maecenas accumsan lacus vel facilisis volutpat est. Laoreet suspendisse interdum consectetur libero id
            faucibus nisl tincidunt. Egestas diam in arcu cursus euismod quis. Pharetra massa massa ultricies mi quis
            hendrerit dolor magna. Lorem ipsum dolor sit amet.
          </p>
          <p>
            Arcu cursus vitae congue mauris rhoncus. Ut ornare lectus sit amet est. Mi eget mauris pharetra et ultrices
            neque ornare. Eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper. Ipsum dolor sit amet consectetur
            adipiscing elit ut. Elementum nibh tellus molestie nunc non blandit.
          </p>
        </div>
        <div className="DashboardDetailSelectedItem__ItemDetail">
          <h2>ItemDetail</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Elit ut aliquam purus sit amet. Id leo in vitae turpis massa sed. Accumsan tortor
            posuere ac ut consequat semper viverra nam. Sociis natoque penatibus et magnis dis parturient montes
            nascetur. Maecenas accumsan lacus vel facilisis volutpat est. Laoreet suspendisse interdum consectetur
            libero id faucibus nisl tincidunt. Egestas diam in arcu cursus euismod quis. Pharetra massa massa ultricies
            mi quis hendrerit dolor magna.
          </p>
          <p>
            Lorem ipsum dolor sit amet. Arcu cursus vitae congue mauris rhoncus. Ut ornare lectus sit amet est. Mi eget
            mauris pharetra et ultrices neque ornare. Eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper.
            Ipsum dolor sit amet consectetur adipiscing elit ut. Elementum nibh tellus molestie nunc non blandit.
          </p>

          <p>
            Porttitor rhoncus dolor purus non. Tempus egestas sed sed risus pretium quam vulputate dignissim
            suspendisse. Eu feugiat pretium nibh ipsum. Feugiat in fermentum posuere urna nec. Eget aliquet nibh
            praesent tristique magna sit amet. Vitae aliquet nec ullamcorper sit. Nisl suscipit adipiscing bibendum est
            ultricies integer. Ac orci phasellus egestas tellus. Auctor elit sed vulputate mi sit amet mauris. Lacus
            viverra vitae
          </p>
          <p>
            congue eu consequat ac. Habitant morbi tristique senectus et netus et malesuada. Ipsum a arcu cursus vitae.
            Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra pharetra
            massa massa ultricies mi quis hendrerit dolor magna. Odio eu feugiat pretium nibh.
          </p>

          <p>
            Nunc congue nisi vitae suscipit tellus mauris. Quis varius quam quisque id diam vel quam elementum pulvinar.
            Amet est placerat in egestas erat. Viverra orci sagittis eu volutpat. Vitae semper quis lectus nulla. Mauris
            sit amet massa vitae tortor condimentum
          </p>
          <p>
            lacinia quis. Ipsum dolor sit amet consectetur adipiscing elit pellentesque. Posuere morbi leo urna
            molestie. Nisi vitae suscipit tellus mauris a diam maecenas. Nibh ipsum consequat nisl vel pretium.
          </p>

          <p>
            Suspendisse in est ante in nibh mauris cursus mattis molestie. Amet nisl suscipit adipiscing bibendum est
            ultricies. Pellentesque adipiscing commodo elit at imperdiet dui. Quis imperdiet massa tincidunt nunc
            pulvinar sapien et ligula. Ut tellus elementum sagittis vitae et leo duis ut diam. Porttitor lacus luctus
            accumsan tortor posuere ac. Vitae semper quis lectus nulla at volutpat diam ut venenatis. Sagittis vitae et
            leo duis ut diam quam. Amet aliquam id diam maecenas ultricies mi eget. Augue mauris augue neque gravida in
            fermentum. Faucibus ornare suspendisse sed nisi lacus sed viverra tellus in. Aliquet nec ullamcorper sit
            amet risus nullam eget.
          </p>

          <p>
            Mollis nunc sed id semper risus in hendrerit. Facilisi nullam vehicula ipsum a arcu. Nec dui nunc mattis
            enim ut tellus elementum. Lobortis mattis aliquam faucibus purus in massa. Non quam lacus suspendisse
            faucibus interdum posuere lorem ipsum. Duis convallis convallis tellus id interdum velit laoreet id. Non
            enim praesent elementum facilisis leo vel fringilla est. Eleifend donec pretium vulputate sapien. Amet nisl
            purus in mollis nunc sed. Aliquam malesuada bibendum arcu vitae elementum. Id porta nibh venenatis cras sed
            felis eget. Aliquam ultrices sagittis orci a scelerisque purus semper. Sit amet est placerat in egestas
            erat. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae. Massa eget egestas purus viverra accumsan
            in. Pharetra magna ac placerat vestibulum lectus mauris ultrices eros in. Tortor id aliquet lectus proin
            nibh nisl condimentum id. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis.
          </p>
        </div>
      </div>
      <div className="DashboardDetailSelectedItem__TaskActions">
        <div>
          <h2 style={{ margin: 0, padding: 0 }}>TaskActions</h2>
          <p>Lorem ipsum dolor sit amet</p>
          <p>consectetur adipiscing elit, sed do eiusmod tempor</p>
          <p>incididunt ut labore et dolore magna aliqua</p>
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
// const { node } = PropTypes
// DashboardDetailSelectedItemPresentation.propTypes = {
//   something: node,
// }

export default DashboardDetailSelectedItemPresentation

import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Select, MenuItem } from '@material-ui/core'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { withStyles } from '@material-ui/core/styles'
import FVLabel from 'views/components/FVLabel/index'

const styles = (theme) => ({
  select: {
    paddingRight: '24px',
  },
  icon: {
    top: '1px',
  },
  root: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1.6rem',
    fontWeight: '700',
  },
})

class TablePaginationActions extends React.Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
  }
  handleFirstPageButtonClick = (event) => {
    this.props.onChangePage(event, 0)
  }

  handleBackButtonClick = (event) => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  handleNextButtonClick = (event) => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  handleLastPageButtonClick = (event) => {
    this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1))
  }

  render() {
    const { count, page, rowsPerPage, classes } = this.props
    const maxPage = Math.ceil(count / rowsPerPage)
    const pageNumbers = Array(maxPage).fill('')
    return (
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', fontSize: '1.6rem', fontWeight: '700' }}>
        <div style={{ marginLeft: '15px', marginTop: '3px' }}>
          <FVLabel transKey="page_num" defaultStr="Page:" transform="first" />
          <Select
            classes={{ root: classes.root, select: classes.select, icon: classes.icon }}
            style={{ paddingLeft: '5px', marginLeft: '5px' }}
            value={page}
            onChange={(ev) => this.props.onChangePage(event, ev.target.value)}
            inputProps={{
              name: 'page',
              id: 'page',
            }}
            disableUnderline={true}
          >
            {pageNumbers.map((m, i) => {
              return (
                <MenuItem key={i.toString()} value={i}>
                  {(i + 1).toString()}
                </MenuItem>
              )
            })}
          </Select>
          / {maxPage}
        </div>
        <IconButton onClick={this.handleFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
          <FirstPageIcon />
        </IconButton>
        <IconButton onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <LastPageIcon />
        </IconButton>
      </div>
    )
  }
}

export default withStyles(styles)(TablePaginationActions)

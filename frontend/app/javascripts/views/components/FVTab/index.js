import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

const styles = (theme) => {
  const { tab } = theme
  const { label = {}, tabsRoot = {}, tabsIndicator = {}, tabRoot = {}, tabSelected = {} } = tab

  return {
    label,
    tabRoot,
    tabSelected,
    tabsIndicator,
    tabsRoot,
  }
}

function FVTab(props) {
  const { classes, tabsStyle, tabsValue, tabsOnChange, tabItems } = props
  const _tabItems = tabItems.map((item, i) => {
    const { label, id, dataTestId, className } = item
    return (
      <Tab
        style={tabsStyle}
        key={i}
        classes={{ root: classes.tabRoot, selected: classes.tabSelected, labelIcon: classes.label }}
        label={label}
        id={id}
        data-testid={dataTestId}
        className={className}
      />
    )
  })

  return (
    <Tabs
      style={tabsStyle}
      classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
      value={tabsValue}
      onChange={tabsOnChange}
    >
      {_tabItems}
    </Tabs>
  )
}

FVTab.propTypes = {
  classes: PropTypes.object.isRequired,
  tabItems: PropTypes.array,
  tabsValue: PropTypes.any,
  tabsStyle: PropTypes.object,
  tabsOnChange: PropTypes.func,
}
FVTab.defaultProps = {
  tabItems: [],
}

export default withStyles(styles)(FVTab)

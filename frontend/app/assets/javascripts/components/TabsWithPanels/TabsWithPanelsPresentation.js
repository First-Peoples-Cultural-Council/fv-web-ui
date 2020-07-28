import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
/**
 * @summary TabsWithPanelsPresentation - ScrollableTabsButtonAuto MUI component with additions/modifications
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} data expects an array of objects, an object for each tab containing a label string, and content array, and any other.
 * data = [
 *   {
 *     label: "any label",
 *     content: [ <h1>Whatever</h1>, <div>content</div>, <div>is wanted in your tab panels</div>, ],
 *   },
 * ]
 *
 * @returns {node} jsx markup
 */

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))

function TabsWithPanelsPresentation({ data }) {
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const tabs = generateTabs(data)
  const tabPanels = generateTabPanels(data, value)

  // React.useEffect(() => {}, [value, tabs, tabPanels]);

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {tabs}
        </Tabs>
      </AppBar>
      {tabPanels}
    </div>
  )
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

// PROPTYPES
const { node, any } = PropTypes
TabPanel.propTypes = {
  children: node,
  index: any.isRequired,
  value: any.isRequired,
}

function generateTabPanels(dataArray, value) {
  const panels = []
  function iterate(item, index) {
    panels.push(
      <TabPanel key={item.label + index} value={value} index={index}>
        {item.content}
      </TabPanel>
    )
  }
  dataArray.forEach(iterate)
  return panels
}

function generateTabs(dataArray) {
  const tabs = []
  function iterate(item, index) {
    tabs.push(<Tab key={item.label} label={item.label} {...a11yProps(index)} />)
  }
  dataArray.forEach(iterate)
  return tabs
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  }
}

// PROPTYPES
const { array } = PropTypes
TabsWithPanelsPresentation.propTypes = {
  data: array,
}

export default TabsWithPanelsPresentation

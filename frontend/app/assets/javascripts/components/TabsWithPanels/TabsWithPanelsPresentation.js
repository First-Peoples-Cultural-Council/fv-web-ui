import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
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
  label: theme.tab.label,
  tabsIndicator: theme.tab.tabsIndicator,
  tabRoot: theme.tab.tabRoot,
  tabsRoot: theme.tab.tabsRoot,
  tabSelected: theme.tab.tabSelected,
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
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          onChange={handleChange}
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
          <Typography variant="h5" component={'div'} style={{ padding: 8 * 3 }}>
            {children}
          </Typography>
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
    if (React.isValidElement(item.content)) {
      panels.push(
        <TabPanel key={item.label + index} value={value} index={index}>
          {item.content}
        </TabPanel>
      )
    }
    panels.push(
      <TabPanel key={item.label + index} value={value} index={index}>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.content),
          }}
        />
      </TabPanel>
    )
  }
  dataArray.forEach(iterate)
  return panels
}

function generateTabs(dataArray) {
  const classes = useStyles()
  const tabs = []
  function iterate(item, index) {
    tabs.push(
      <Tab
        key={item.label}
        classes={{ root: classes.tabRoot, selected: classes.tabSelected, labelIcon: classes.label }}
        label={item.label}
        {...a11yProps(index)}
      />
    )
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

import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'

import DocumentView from 'views/components/Document/view'
import FVButton from 'views/components/FVButton'
import Link from 'views/components/Link'
import ListPresentation from 'components/List/ListPresentation'
import ListTasksData from 'components/ListTasks/ListTasksData'
import DashboardTasksData from './DashboardTasksData'
import StringHelpers from 'common/StringHelpers'
import '!style-loader!css-loader!./DashboardTasks.css'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
/**
 * @summary DashboardTasksContainer
 * @version 1.0.1
 * @component
 *
 * @returns {node} jsx markup
 */
function DashboardTasksContainer() {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('xs'))
  const container = window.document.body
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const onRowClick = isXs ? handleDrawerToggle : undefined
  return (
    <DashboardTasksData>
      {({ intl, isDialogOpen, onCloseDialog, onOpenDialog, selectedTaskId }) => {
        return (
          <>
            <h1>{intl.trans('tasks', 'Tasks', 'first')}</h1>

            <ListTasksData
              columnRender={{
                documentTitle: ({ docref, documentTitle }) => {
                  return (
                    <FVButton
                      variant="outlined"
                      color="secondary"
                      className="DashboardTasks__taskTitle"
                      onClick={() => {
                        onOpenDialog(docref)
                      }}
                    >
                      {documentTitle}
                    </FVButton>
                  )
                },
                taskName: ({ taskName }) => intl.searchAndReplace(taskName),
                dueDate: ({ dueDate }) => StringHelpers.formatUTCDateString(dueDate),
              }}
            >
              {({
                columns,
                hasRegistrationTasks,
                hasTasks,
                isActingOnATask,
                onTaskApprove,
                onTaskReject,
                options,
                tasks,
                userRegistrationTasks,
              }) => {
                // Getting tasks
                if (hasTasks === undefined && hasRegistrationTasks === undefined) {
                  return null
                }
                // No tasks at all
                if (hasTasks === false && hasRegistrationTasks === false) {
                  return <h2>{intl.trans('views.pages.tasks.no_tasks', 'There are currently No tasks.')}</h2>
                }
                // Have tasks...
                let userRegistrationTasksList = null
                if (userRegistrationTasks) {
                  userRegistrationTasksList = (
                    <ul>
                      {userRegistrationTasks.map(({ href, dialectName }, i) => {
                        return (
                          <li key={i}>
                            <Link href={href}>
                              Click here to view user registration requests to join <strong>{dialectName}</strong>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )
                }
                return (
                  <>
                    {userRegistrationTasksList}

                    {hasTasks && (
                      <>
                        <ListPresentation
                          actions={[
                            {
                              actionType: 'approve',
                              icon: 'check',
                              tooltip: 'Approve',
                              onClick: (event, { id }) => onTaskApprove({ id }),
                              disabled: isActingOnATask,
                            },
                            {
                              actionType: 'reject',
                              icon: 'clear',
                              tooltip: 'Reject',
                              onClick: (event, { id }) => onTaskReject({ id }),
                              disabled: isActingOnATask,
                            },
                          ]}
                          onRowClick={onRowClick}
                          columns={columns}
                          data={tasks}
                          options={options}
                        />

                        <Dialog fullWidth maxWidth="md" open={isDialogOpen} onClose={onCloseDialog}>
                          <DialogContent>{selectedTaskId && <DocumentView id={selectedTaskId} />}</DialogContent>
                        </Dialog>
                      </>
                    )}
                  </>
                )
              }}
            </ListTasksData>

            <Hidden smUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                drawer temporary content
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer anchor={'right'} variant="permanent" open>
                drawer permanent content
              </Drawer>
            </Hidden>
          </>
        )
      }}
    </DashboardTasksData>
  )
}

export default DashboardTasksContainer

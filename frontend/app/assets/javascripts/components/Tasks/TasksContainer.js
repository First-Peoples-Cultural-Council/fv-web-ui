import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'

import DocumentView from 'views/components/Document/view'
import FVButton from 'views/components/FVButton'
import Link from 'views/components/Link'
import ListPresentation from 'components/List/ListPresentation'
import ListTasksData from 'components/ListTasks/ListTasksData'
import TasksData from './TasksData'
import StringHelpers from 'common/StringHelpers'

import '!style-loader!css-loader!./Tasks.css'
/**
 * @summary TasksContainer
 * @version 1.0.1
 * @component
 *
 * @returns {node} jsx markup
 */
function TasksContainer() {
  return (
    <TasksData>
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
                      className="Tasks__taskTitle"
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
          </>
        )
      }}
    </TasksData>
  )
}

export default TasksContainer

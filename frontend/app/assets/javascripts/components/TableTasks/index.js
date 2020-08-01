import TableTasksData from './TableTasksData'

export default {
  // Container: no dedicated component. Had to hook up modal event handlers that are used by multiple items. See /Tasks/TasksContainer
  // Presentation: no dedicated component. Using /Table/TablePresentation. See /Tasks/TasksContainer
  Data: TableTasksData,
}

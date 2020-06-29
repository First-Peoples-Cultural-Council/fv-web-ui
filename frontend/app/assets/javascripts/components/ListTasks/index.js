import ListTasksData from './ListTasksData'

export default {
  // Container: no dedicated component. Had to hook up modal event handlers that are used by multiple items. See /Tasks/TasksContainer
  // Presentation: no dedicated component. Using /List/ListPresentation. See /Tasks/TasksContainer
  Data: ListTasksData,
}

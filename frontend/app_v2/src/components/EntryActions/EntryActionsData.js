import { copy, share } from 'common/actionHelpers'

/**
 * @summary EntryActionsData
 * @component
 *
 * @param {object} props
 *
 */
function EntryActionsData({ actions, moreActions }) {
  const actionsToShow = []
  const moreActionsToShow = []

  function addActionHelper(action, array) {
    switch (action) {
      case 'copy':
        array.push(copy)
        break
      case 'share':
        array.push(share)
        break
      default:
        break
    }
  }

  if (actions && actions?.length > 0) {
    actions.forEach((action) => addActionHelper(action, actionsToShow))
  }

  if (moreActions && moreActions?.length > 0) {
    moreActions.map((action) => addActionHelper(action, moreActionsToShow))
  }

  return {
    actionsToShow,
    moreActionsToShow,
  }
}

export default EntryActionsData

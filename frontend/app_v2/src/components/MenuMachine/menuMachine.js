/* Potential enhancements to consider
- Down arrow support: opens a closed sub-menu, moves to next sub-menu item (ie: tab)
- Up arrow support: moves to previous sub-menu item (ie: shift-tab)
- Jest test machine OR (a more exciting option is to) look into using @xstate/test
  which generates tests for all states of the machine!
  https://github.com/davidkpiano/xstate/tree/master/packages/xstate-test
- User Menu > Workspace Toggle:
  -- add a focus ring
  -- make the whole item a button. So clicking on the text would trigger the toggle as well.
  -- The toggle is responding to the space bar, consider adding enter/return support
*/
import { Machine, assign } from 'xstate'
const menuMachine = Machine(
  {
    id: 'DialectHeader',
    initial: 'idle',
    context: {
      openMenu: undefined,
    },
    states: {
      idle: {
        entry: ['closeMenu'],
        on: {
          OPEN: 'open',
        },
      },
      open: {
        entry: ['openMenu'],
        on: {
          CLOSE: 'idle',
          OPEN: { target: 'open' },
        },
      },
    },
  },
  {
    actions: {
      closeMenu: assign(() => {
        return { openMenu: undefined }
      }),
      openMenu: assign((context, { menuId }) => {
        return { openMenu: menuId }
      }),
    },
  }
)

export default menuMachine

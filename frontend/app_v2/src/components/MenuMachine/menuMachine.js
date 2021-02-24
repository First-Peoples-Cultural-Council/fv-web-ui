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
          CLICK_TOGGLE: 'request',
          CLOSE: 'idle',
          OPEN: { target: 'open' },
        },
      },
      request: {
        on: {
          REQUEST_SUCCESS: 'open',
          REQUEST_ERROR: 'open',
          CLOSE: 'idle',
        },
      },
    },
  },
  {
    actions: {
      closeMenu: assign((context, event) => {
        console.log('closeMenu!', context, event)
        return { openMenu: undefined }
      }),
      openMenu: assign((context, { menuId }) => {
        console.log('openMenu!', context, menuId)
        return { openMenu: menuId }
      }),
    },
  }
)

export default menuMachine

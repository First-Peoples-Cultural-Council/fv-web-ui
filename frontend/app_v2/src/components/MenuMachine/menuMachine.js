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

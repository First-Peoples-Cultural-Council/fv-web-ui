const copy = {
  title: (dialect) => `Add New Word${dialect ? ` to ${dialect}` : ''}`,
  submit: 'Create new word',

  validation: {
    title: 'Please fill in the word',
  },
}
export default copy

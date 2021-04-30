// Setting the errorStatusCode will trigger the render of the ErrorHandler component
export const triggerError = (error, history) => {
  history.replace(history.location.pathname, {
    errorStatusCode: error?.response?.status,
  })
}

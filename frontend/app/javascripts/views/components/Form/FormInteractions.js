/*
WHAT: Will return the index of a matching `element.props.id` within a collection of JSX elements
INPUT: { id, items: [jsx] }
OUTPUT: index pos or -1
*/
export const getIndexOfElementById = (arg) => {
  const { id, items } = arg
  return items.findIndex((element) => {
    return element.props.id === id
  })
}
/*
WHAT: Will remove matching `element.props.id` within a collection of JSX elements
INPUT: { id, items: [jsx] }
OUTPUT: items with item removed or unchanged if item not found
*/
export const removeItem = (arg) => {
  const { id, items } = arg
  // remove item
  const sourceIndex = getIndexOfElementById({ id, items })
  if (sourceIndex !== -1) {
    return items.filter((element) => {
      return element.props.id !== id
    })
  }
  // or return without changes
  return items
}
/*
WHAT: Will move a matching `element.props.id` within a collection of JSX elements one position to the back
INPUT:  { id, items: [jsx] }
OUTPUT:  items but with the element matching the ID moved down in the array (towards index === items.length)
*/
export const moveItemDown = (arg) => {
  const { id, items } = arg
  return moveItem({ direction: 1, id, items })
}
/*
WHAT: Will move a matching `element.props.id` within a collection of JSX elements one position to the front
INPUT: { id, items: [jsx] }
OUTPUT: items but with the element matching the ID moved up in the array (towards index === 0)
*/
export const moveItemUp = (arg) => {
  const { id, items } = arg
  return moveItem({ direction: -1, id, items })
}

/*
WHAT: Will move a matching `element.props.id` within a collection of JSX elements specified by the `direction` property
INPUT: { direction, id, items: [jsx] }
OUTPUT: items but with the element matching the ID moved up/down in the array (based on direction int)
*/
const moveItem = (arg) => {
  const { direction, id, items } = arg
  const _items = [...items]

  const sourceIndex = getIndexOfElementById({ id, items })
  const sourceItem = _items[sourceIndex]
  let destinationIndex = sourceIndex + direction

  // correct for overshoots
  if (destinationIndex >= _items.length) {
    destinationIndex = _items.length - 1
  }
  if (destinationIndex < 0) {
    destinationIndex = 0
  }

  // swap
  _items[sourceIndex] = _items[destinationIndex]
  _items[destinationIndex] = sourceItem

  return _items
}

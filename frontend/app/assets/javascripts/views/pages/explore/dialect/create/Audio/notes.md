# States

## Loading - STATE_LOADING

Spinner screen. Form will probably need to get dialect or user data on load.

## Default - STATE_DEFAULT

Form with default values, no error messages

REQUIREMENT: Should be able to initialize form with specified values & errors

## Error - STATE_ERROR

Form validation errors

## Success - STATE_SUCCESS

Form sucessfully submitted, example content: message, link to item, link to create more items

## JS Error - STATE_ERROR_BOUNDARY

Component scripting triggered an error or there's a vital dependency missing (eg: no api, etc)
AKA: "Down for maintenance", "Can't do that right now", etc

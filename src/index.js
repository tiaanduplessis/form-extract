/* global HTMLElement */

// https://stackoverflow.com/a/384380
function isElement (o) {
  return typeof HTMLElement === 'object'
    ? o instanceof HTMLElement
    : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
}

export default function formExtract (form) {
  let formElement
  if (typeof form === 'string') {
    formElement = document.querySelector(form)
  } else if (isElement(form)) {
    formElement = form
  } else {
    throw new Error('Invalid argument provided. Should be a string selector or element.')
  }

  const inputs = Array.from(
    formElement.querySelectorAll('input, textarea, select, [contenteditable=true]')
  ) || []

  return inputs
    .reduce((arr, input) => {
      let { name = 'unamed', value, type } = input

      if (input.getAttribute('contenteditable') === 'true') {
        value = input.innerHTML
      }

      if ((type === 'checkbox' || type === 'radio') && !input.checked) {
        return arr
      }

      if (type === 'submit') {
        return arr
      }

      arr.push({
        name: name,
        value: value
      })

      return arr
    }, [])
    .reduce((result, { name, value }) => {
      if (result[name]) {
        if (Array.isArray(result[name])) {
          result[name].push(value)
        } else {
          result[name] = [result[name], value]
        }
      } else {
        result[name] = value
      }

      return result
    }, {})
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.formExtract = factory());
})(this, (function () { 'use strict';

  /* global HTMLElement */

  // https://stackoverflow.com/a/384380
  function isElement(o) {
    return typeof HTMLElement === 'object' ? o instanceof HTMLElement : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
  }
  function formExtract(form) {
    var formElement;
    if (typeof form === 'string') {
      formElement = document.querySelector(form);
    } else if (isElement(form)) {
      formElement = form;
    } else {
      throw new Error('Invalid argument provided. Should be a string selector or element.');
    }
    var inputs = Array.from(formElement.querySelectorAll('input, textarea, select, [contenteditable=true]')) || [];
    return inputs.reduce(function (arr, input) {
      var _input$name = input.name,
        name = _input$name === void 0 ? 'unamed' : _input$name,
        value = input.value,
        type = input.type;
      if (input.getAttribute('contenteditable') === 'true') {
        value = input.innerHTML;
      }
      if ((type === 'checkbox' || type === 'radio') && !input.checked) {
        return arr;
      }
      if (type === 'submit') {
        return arr;
      }
      arr.push({
        name: name,
        value: value
      });
      return arr;
    }, []).reduce(function (result, _ref) {
      var name = _ref.name,
        value = _ref.value;
      if (Object.prototype.hasOwnProperty.call(result, name)) {
        if (Array.isArray(result[name])) {
          result[name].push(value);
        } else {
          result[name] = [result[name], value];
        }
      } else {
        Object.defineProperty(result, name, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
      return result;
    }, {});
  }

  return formExtract;

}));

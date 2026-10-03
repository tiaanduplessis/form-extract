import assert from 'node:assert/strict'

const canonical = (value) => JSON.parse(JSON.stringify(value))

export const cases = [
  [
    'accepts a selector and extracts text, textarea and select values',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form id="form"><input name="text" value="hello"><textarea name="notes">two lines</textarea><select name="choice"><option value="a">A</option><option value="b" selected>B</option></select></form>'
      assert.deepEqual(canonical(extract('#form')), {
        text: 'hello',
        notes: 'two lines',
        choice: 'b'
      })
    }
  ],
  [
    'accepts an element and only reads its descendants',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<input name="outside" value="ignored"><form><input name="inside" value="kept"></form>'
      assert.deepEqual(canonical(extract(document.querySelector('form'))), { inside: 'kept' })
    }
  ],
  [
    'returns an empty object for an empty form',
    ({ extract, document }) => {
      assert.deepEqual(canonical(extract(document.createElement('form'))), {})
    }
  ],
  [
    'collects three repeated nonempty names in DOM order',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input name="item" value="one"><input name="item" value="two"><input name="item" value="three"></form>'
      assert.deepEqual(canonical(extract('form')), { item: ['one', 'two', 'three'] })
    }
  ],
  [
    'preserves an empty first value in DOM order',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input name="item" value=""><input name="item" value="two"><input name="item" value="three"></form>'
      assert.deepEqual(canonical(extract('form')), { item: ['', 'two', 'three'] })
    }
  ],
  [
    'preserves empty later values and a single empty value',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input name="item" value="one"><input name="item" value=""><input name="empty" value=""></form>'
      assert.deepEqual(canonical(extract('form')), { item: ['one', ''], empty: '' })
    }
  ],
  [
    'includes only checked checkboxes and radio buttons',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input type="checkbox" name="items" value="a" checked><input type="checkbox" name="items" value="b"><input type="checkbox" name="items" value="c" checked><input type="radio" name="choice" value="yes" checked><input type="radio" name="choice" value="no"><input type="checkbox" name="unchecked"><input type="checkbox" name="defaultValue" checked></form>'
      assert.deepEqual(canonical(extract('form')), {
        items: ['a', 'c'],
        choice: 'yes',
        defaultValue: 'on'
      })
    }
  ],
  [
    'excludes submit controls and buttons',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input name="text" value="ok"><input type="submit" name="submit" value="send"><button name="button" value="ignored">Send</button></form>'
      assert.deepEqual(canonical(extract('form')), { text: 'ok' })
    }
  ],
  [
    'reads contenteditable innerHTML using the existing unamed fallback',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><div contenteditable="true" name="ignored-attribute"><b>hello</b></div><div contenteditable="false">ignored</div></form>'
      assert.deepEqual(canonical(extract('form')), { unamed: '<b>hello</b>' })
    }
  ],
  [
    'uses a contenteditable name property when present',
    ({ extract, document }) => {
      document.body.innerHTML = '<form><div contenteditable="true"><i>hello</i></div></form>'
      document.querySelector('div').name = 'richText'
      assert.deepEqual(canonical(extract('form')), { richText: '<i>hello</i>' })
    }
  ],
  [
    'characterizes unnamed inputs, disabled inputs and multiple selects',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input value="unnamed"><input name="disabled" value="included" disabled><select name="multiple" multiple><option value="a" selected>A</option><option value="b" selected>B</option></select></form>'
      assert.deepEqual(canonical(extract('form')), {
        '': 'unnamed',
        disabled: 'included',
        multiple: 'a'
      })
    }
  ],
  [
    'rejects invalid arguments with the established message',
    ({ extract, document }) => {
      for (const value of [
        undefined,
        null,
        0,
        true,
        {},
        [],
        document,
        document.createTextNode('text')
      ]) {
        assert.throws(() => extract(value), {
          message: 'Invalid argument provided. Should be a string selector or element.'
        })
      }
    }
  ],
  [
    'preserves DOM SyntaxError for an invalid selector',
    ({ extract }) => {
      assert.throws(() => extract('['), { name: 'SyntaxError' })
    }
  ],
  [
    'preserves TypeError for a missing selector',
    ({ extract }) => {
      assert.throws(() => extract('#missing'), { name: 'TypeError' })
    }
  ],
  [
    'preserves repeated empty values, including unnamed fields',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input name="empty" value=""><input name="empty" value=""><input name="empty" value=""><input value=""><textarea></textarea><input value="last"></form>'
      assert.deepEqual(canonical(extract('form')), {
        empty: ['', '', ''],
        '': ['', '', 'last']
      })
    }
  ],
  [
    'keeps mixed repeated controls in DOM order and skips unchecked controls',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input type="checkbox" name="item" value="skipped"><input name="item" value=""><textarea name="item">notes</textarea><select name="item"><option value="" selected>Empty</option></select><input type="checkbox" name="item" value="" checked><input type="radio" name="item" value="chosen" checked><input type="radio" name="item" value="skipped"><div contenteditable="true"></div><div contenteditable="true"><b>last</b></div><input type="submit" name="item" value="skipped"></form>'
      for (const editable of document.querySelectorAll('[contenteditable]')) {
        editable.name = 'item'
      }
      assert.deepEqual(canonical(extract('form')), {
        item: ['', 'notes', '', '', 'chosen', '', '<b>last</b>']
      })
    }
  ],
  [
    'returns an empty plain object when all controls are excluded',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input type="checkbox" name="__proto__"><input type="radio" name="constructor"><input type="submit" name="toString"><button name="button">Submit</button><div contenteditable="false">ignored</div></form>'
      const empty = extract(document.createElement('form'))
      const result = extract('form')
      assert.deepEqual(Object.keys(result), [])
      assert.equal(Object.getPrototypeOf(result), Object.getPrototypeOf(empty))
    }
  ],
  [
    'stores inherited names as own enumerable data properties on a plain object',
    ({ extract, document }) => {
      const form = document.createElement('form')
      const prototype = Object.getPrototypeOf(extract(form))
      const names = Object.getOwnPropertyNames(prototype)
      for (const name of names) {
        const input = document.createElement('input')
        input.name = name
        input.value = name === '__proto__' ? '' : 'value'
        form.appendChild(input)
      }
      const result = extract(form)
      assert.notEqual(prototype, null)
      assert.equal(Object.getPrototypeOf(prototype), null)
      assert.equal(Object.getPrototypeOf(result), prototype)
      assert.deepEqual(Object.keys(result), names)
      const serialized = canonical(result)
      for (const name of names) {
        const value = name === '__proto__' ? '' : 'value'
        assert.deepEqual(Object.getOwnPropertyDescriptor(result, name), {
          value,
          writable: true,
          enumerable: true,
          configurable: true
        })
        assert.equal(serialized[name], value)
      }
    }
  ],
  [
    'collects repeated inherited names without changing the result prototype',
    ({ extract, document }) => {
      const form = document.createElement('form')
      const prototype = Object.getPrototypeOf(extract(form))
      const names = Object.getOwnPropertyNames(prototype)
      for (const value of ['', 'second', '']) {
        for (const name of names) {
          const input = document.createElement('input')
          input.name = name
          input.value = value
          form.appendChild(input)
        }
      }
      const result = extract(form)
      assert.equal(Object.getPrototypeOf(result), prototype)
      assert.deepEqual(Object.keys(result), names)
      for (const name of names) {
        assert.deepEqual(canonical(result[name]), ['', 'second', ''])
        assert.equal(Object.hasOwn(result, name), true)
      }
    }
  ],
  [
    'does not carry values between calls or alter earlier results',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input name="__proto__" value=""><input name="__proto__" value="next"><input name="constructor" value="one"></form>'
      const first = extract('form')
      const second = extract('form')
      assert.notEqual(first, second)
      assert.notEqual(first.__proto__, second.__proto__)
      first.__proto__.push('changed')
      assert.deepEqual(canonical(second.__proto__), ['', 'next'])
      assert.equal(second.constructor, 'one')
      assert.deepEqual(canonical(extract(document.createElement('form'))), {})
    }
  ]
]

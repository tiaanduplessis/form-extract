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
    'characterizes the existing empty-first-value overwrite',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input name="item" value=""><input name="item" value="two"><input name="item" value="three"></form>'
      // Existing truthiness bug: the first empty value is lost. Do not fix in a tooling refresh.
      assert.deepEqual(canonical(extract('form')), { item: ['two', 'three'] })
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
    'characterizes inherited-key collisions without repairing them',
    ({ extract, document }) => {
      document.body.innerHTML =
        '<form><input name="constructor" value="value"><input name="toString" value="text"></form>'
      const result = extract('form')
      assert.equal(typeof result.constructor[0], 'function')
      assert.equal(result.constructor[1], 'value')
      assert.equal(typeof result.toString[0], 'function')
      assert.equal(result.toString[1], 'text')
    }
  ]
]

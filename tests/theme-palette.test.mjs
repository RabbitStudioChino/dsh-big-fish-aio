import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { themePaletteCSS } from '../lib/theme-palette.mjs'

const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8')
const tokens = css => new Set([...css.matchAll(/(--(?:fish|fm)-[\w-]+)\s*:/g)].map(match => match[1]))

test('深浅两套色库具有相同变量，布局和挂饰引用的颜色均有定义', () => {
  const light = read('assets/themes/light.css'), dark = read('assets/themes/dark.css')
  assert.deepEqual(tokens(light), tokens(dark))
  const layout = read('src/theme.css'), widget = read('modules/mood/assets/widget.js')
  const defined = tokens(themePaletteCSS + layout + widget)
  for (const match of (layout + widget).matchAll(/var\((--(?:fish|fm)-[\w-]+)([,)]?)/g)) {
    if (match[2] !== ',') assert.ok(defined.has(match[1]), match[1])
  }
  assert.doesNotMatch(layout + widget + read('src/stickers.js'), /#[0-9a-f]{3,8}\b|rgba?\(\s*\d/i, '固定颜色只在色库中维护')
  assert.match(light, /color-scheme: light/)
  assert.match(dark, /body\[data-ds-dark-theme\]/)
  assert.match(dark, /:host\(\[data-theme=dark\]\)/)
})

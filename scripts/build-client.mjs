import { readFileSync, writeFileSync } from 'node:fs'

import { themePaletteCSS } from '../lib/theme-palette.mjs'
import { bigfishImages, bigfishImageUrl, reportBackgrounds, reportBackgroundUrl } from '../lib/bigfish-assets.mjs'
import { scheduleRepeats } from '../lib/schedule-calendar.mjs'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const meta = JSON.parse(read('package.json'))
// 模块保持各自的闭包；只导出组件，不再分别注册设置插件。
const output = `// 自动生成：修改 src/panel.js 或 modules/*/lib/client.js 后运行 npm run build。\n` +
  `window.__ModuleLoader__.load({ id: ${JSON.stringify(meta.name)}, factory(require) {\n` +
  `const FISH_PALETTE_CSS = ${JSON.stringify(themePaletteCSS)};\n` +
  `const FISH_THEME_CSS = FISH_PALETTE_CSS + ${JSON.stringify(read('src/theme.css'))};\n` +
  `if (typeof document !== 'undefined' && document.body) { try {\n` + read('modules/mood/assets/widget.js') +
  `\n} catch (error) { delete window.__feiyuMoodVersion; console.warn('[大肥鱼] 挂饰初始化失败', error) } }\n` +
  `const BIGFISH_IMAGES = ${JSON.stringify(bigfishImages.map(bigfishImageUrl))};\n` +
  `const RICE_BACKGROUNDS = ${JSON.stringify(Object.fromEntries(Object.entries(reportBackgrounds).map(([theme, assets]) => [theme, assets.map(reportBackgroundUrl)])))};\n` +
  `const components = {};\nconst moduleLoader = { load({id, factory}) { components[id] = factory(require) } };\n` +
  read('src/stickers.js') + '\n' +
  read('src/qq-storage.js') + '\n' +
  read('src/controls.js') + '\n' +
  read('modules/qq/lib/client.js').replaceAll('window.__ModuleLoader__.load(', 'moduleLoader.load(') + '\n' +
  read('modules/memory/lib/client.js').replaceAll('window.__ModuleLoader__.load(', 'moduleLoader.load(') + '\n' +
  read('modules/mood/client.js').replaceAll('window.__ModuleLoader__.load(', 'moduleLoader.load(') + '\n' +
  read('modules/speak/lib/client.js').replaceAll('window.__ModuleLoader__.load(', 'moduleLoader.load(') + '\n' +
  `const META = ${JSON.stringify({ name: meta.name, version: meta.version, upstreamCompatibility: meta.upstreamCompatibility })};\n` +
  read('src/update-log.js') + '\n' +
  read('src/update-notifier.js') + '\n' +
  ['open-platform-schema', 'open-platform-http', 'open-platform-import'].map(name =>
    read('lib/' + name + '.mjs').replace(/^import .*\n/gm, '').replaceAll('export function ', 'function ') + '\n').join('') +
  `const PLATFORM_PLUGIN_PROMPT = ${JSON.stringify(read('docs/open-platform-plugin-prompt.md'))};\n` +
  read('src/open-platform.js') + '\n' +
  `const SCHEDULE_REPEATS = ${JSON.stringify(scheduleRepeats)};\n` +
  read('src/scheduled-messages.js') + '\n' +
  read('src/notifications.js') + '\n' +
  read('src/rice-report.js') + '\n' +
  read('src/panel.js') + '\n} });\n'
writeFileSync(new URL('client.js', root), output)

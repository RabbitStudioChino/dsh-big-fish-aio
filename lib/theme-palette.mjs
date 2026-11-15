import { readFileSync } from 'node:fs'

// 打包界面与独立挂饰路由使用同一份色库，避免两条加载路径出现配色差异。
export const themePaletteCSS = ['light', 'dark'].map(theme =>
  readFileSync(new URL('../assets/themes/' + theme + '.css', import.meta.url), 'utf8')).join('\n')

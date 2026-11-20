import { readdirSync, readFileSync } from 'node:fs'

const directory = new URL('../assets/', import.meta.url)
export const bigfishImages = readdirSync(new URL('bigfish/', directory)).filter(name => /^(sticker-[a-z-]+)\.png$/.test(name)).sort()
export const bigfishImageUrl = name => '/dsh-big-fish-aio/bigfish/' + name
export const reportBackgroundUrl = asset => '/dsh-big-fish-aio/report-background/' + asset
export const reportBackgrounds = Object.fromEntries(Object.entries({ ocean: 'bigfish', claude: 'claude', gpt: 'gpt' }).map(([theme, folder]) => [
  theme, readdirSync(new URL(folder + '/', directory)).filter(name => /^0[1-5]-[a-z-]+\.webp$/.test(name)).sort().map(name => folder + '/' + name),
]))

const legacyImages = {
  'welcome.png': 'sticker-welcome.png',
  'update.png': 'sticker-update.png',
  'exec-3c31309b-9af6-4dcd-bfaf-ce8e18f7d67b.png': 'sticker-chat.png',
  'exec-4a911bc6-c8f6-4bc8-839a-a98db0b7b67d.png': 'sticker-welcome.png',
  'exec-cf469e85-6c78-4fc1-9c25-6cfb02693581.png': 'sticker-heart.png',
  'exec-93b22517-e732-49c4-a8c4-704748585fe2.png': 'sticker-gift.png',
  'exec-77112d8e-1aa6-48cd-bb4a-4eb30eef56dd.png': 'sticker-wave.png',
  'exec-7f1c2315-088c-4354-bedc-fc5c4c1c27ef.png': 'sticker-read.png',
  'exec-b273f2f8-ff54-410d-9391-d70213fcb944.png': 'sticker-book.png',
}

export function registerBigfishAssets(ctx) {
  const stickers = [...bigfishImages.map(name => [name, name]), ...Object.entries(legacyImages)]
    .map(([routeName, name]) => [bigfishImageUrl(routeName), 'bigfish/' + name])
  const backgrounds = Object.values(reportBackgrounds).flat().map(asset => [reportBackgroundUrl(asset), asset])
  for (const [path, asset] of [...stickers, ...backgrounds]) ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path,
    handler: async (req, res) => {
      try {
        const bytes = readFileSync(new URL(asset, directory))
        res.writeHead(200, { 'content-type': asset.endsWith('.webp') ? 'image/webp' : 'image/png', 'cache-control': 'public, max-age=86400' })
        res.end(bytes)
      } catch {
        res.writeHead(404, { 'content-type': 'text/plain' })
        res.end('image not found')
      }
    },
  }))
}

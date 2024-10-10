import path from 'node:path'
import fs from 'fs-extra'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

function copyFile() {
  return {
    enforce: 'post',
    async writeBundle() {
      await fs.copy(
        path.join(__dirname, '/src/components'),
        path.join(__dirname, '/package'),
      )
    },
  } as unknown as PluginOption
}

export default async () => {
  const UnoCSS = (await import('unocss/vite')).default
  const presetWeapp = (await import('unocss-preset-weapp')).default
  const transformerDirective = (await import('@unocss/transformer-directives')).default

  return defineConfig({
    plugins: [
      uni(),
      UnoCSS({
        presets: [
          presetWeapp({
            // whRpx: false,
          }),
          presetWeappAttributify(),
        ],
        transformers: [
          transformerAttributify(),
          transformerClass(),
          transformerDirective(),
        ],
      }),
      copyFile(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  })
}

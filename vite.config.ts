import path from 'node:path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

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

        theme: {
          fontSize: {
            'xs': ['20rpx', '32rpx'],
            'sm': ['24rpx', '36rpx'],
            'base': ['28rpx', '40rpx'],
            'lg': ['32rpx', '44rpx'],
            'xl': ['36rpx', '48rpx'],
            '2xl': ['40rpx', '52rpx'],
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  })
}

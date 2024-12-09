import type { IConfig } from './interface'
import { useStyle } from './hooks'

const uniCompsConfig = import.meta.glob('/uni-comps.config.ts', { eager: true })['/uni-comps.config.ts'] as unknown as AnyObject
const customConfig = uniCompsConfig?.default || {}

const defaultConfig: IConfig = {
  style: {
    ...useStyle({
      paddingLeft: '20rpx',
      paddingRight: '20rpx',
    }, ['button']),
  },
  size: {
    mini: '40rpx',
    small: '56rpx',
    normal: '72rpx',
    large: '88rpx',
  },
  fontSize: {
    mini: '24rpx',
    small: '28rpx',
    normal: '32rpx',
    large: '36rpx',
  },
}

export const style = customConfig.style || defaultConfig.style

export const size = customConfig.size || defaultConfig.size

export const fontSize = customConfig.fontSize || defaultConfig.fontSize

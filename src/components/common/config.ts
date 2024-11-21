import type { IConfig } from './interface'
import customConfig from '/uni-comps.config.js'

export function useStyle(attribute: AnyObject, componentNames: string[]) {
  const style: AnyObject = {}

  for (let i = 0; i < componentNames.length; i++) {
    const name = componentNames[i]

    style[name] = attribute
  }
  return style
}

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

import { useStyle } from './src/components/common/config'
import type { IConfig } from './src/components/common/interface'

const config: IConfig = {
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

export default config

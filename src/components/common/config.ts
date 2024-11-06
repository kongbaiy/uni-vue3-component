export const styles: AnyObject = {}

export const sizes: AnyObject = {
  mini: '40rpx',
  small: '56rpx',
  normal: '72rpx',
  large: '88rpx',
}

export const fontSizes: AnyObject = {
  mini: '24rpx',
  small: '28rpx',
  normal: '32rpx',
  large: '36rpx',
}

function style(style: AnyObject, componentNames: string[]) {
  for (let i = 0; i < componentNames.length; i++) {
    const name = componentNames[i]
    styles[name] = style
  }
}
style({
  paddingLeft: '20rpx',
  paddingRight: '20rpx',
}, ['button'])

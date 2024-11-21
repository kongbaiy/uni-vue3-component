interface IStyle {
  [key: string]: AnyObject
}

interface ISize {
  mini: string
  small: string
  normal: string
  large: string
}

export interface IConfig {
  style: IStyle
  size: ISize
  fontSize: ISize
}

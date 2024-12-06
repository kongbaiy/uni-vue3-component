export function useStyle(attribute: AnyObject, componentNames: string[]) {
  const style: AnyObject = {}

  for (let i = 0; i < componentNames.length; i++) {
    const name = componentNames[i]

    style[name] = attribute
  }
  return style
}

import { tokens } from '../tokens'
import { flattenObject } from '../flattenObject'

// Transform tokens to a flat list of CSS variables and values to inject into the page
// IN: { colors: { black: '#000' } }, OUT: { '--fr-colors-black': '#000' }
export function createThemeVariables(tokens) {
  return flattenObject(tokens, '--fr', '-')
}

// Swap token values out and replace them with the CSS variables we defined
// IN: { colors: { black: '#000' } }, OUT: { colors: { black: 'var(--fr-colors-black)' } }
function mapTokensToThemeVariables(obj, path = '--fr') {
  const newObj: Record<string, any> = {}

  Object.keys(obj).forEach((key) => {
    const currentValue = obj[key]

    if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)) {
      newObj[key] = mapTokensToThemeVariables(currentValue, `${path}-${key}`)
    } else {
      newObj[key] = `var(${path}-${key})`
    }
  })

  return newObj
}

export const themeVariables = createThemeVariables(tokens)

export const theme = mapTokensToThemeVariables(tokens)

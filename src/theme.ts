import { theme as chakraTheme } from '@chakra-ui/core'

const fonts = { ...chakraTheme.fonts, mono: `'Menlo', monospace` }

const breakpoints = ['40em', '52em', '64em']

const theme = {
  ...chakraTheme,
  colors: {
    ...chakraTheme.colors,
    black: '#16161D',
    grey: '#E2E8F0',
    af: {
      teal: '#45BCC8',
      violet: '#765EA6',
      pink: '#E27CB0',
      yellow: '#FCCE36',
    },
  },
  fonts,
  breakpoints,
}

export default theme

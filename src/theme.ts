import { extendTheme } from '@chakra-ui/react'

const theme = {
  styles: {
    global: {
      html: {
        width: '100%',
        height: '100%',
      },
      body: {
        // fontFamily: 'Manrope',
        width: '100%',
        height: '100%',
      },
    },
  },
  colors: {
    black: '#16161D',
    grey: '#E2E8F0',
    af: {
      teal: '#45BCC8',
      violet: '#765EA6',
      pink: '#E27CB0',
      yellow: '#FCCE36',
    },
  },
  components: {
    Card: {
      baseStyle: {
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.02)',
        background: 'white',
        rounded: '0.75rem',
        p: '1rem',
      },
      variants: {},
    },
    Button: {
      variants: {
        important: {
          color: 'white',
          bg: 'af.pink',
          px: '2rem',
        },
        primary: {
          color: 'white',
          bg: 'af.teal',
          px: '2rem',
        },
        secondary: {
          color: 'af.teal',
          bg: 'rgba(71, 188, 200, 0.1);',
          px: '2rem',
        },
      },
    },
    Input: {
      defaultProps: {
        variant: 'af',
      },
      variants: {
        outline: {
          field: {
            _focus: {
              boxShadow: '0 0 0 1px #45BCC8',
              borderColor: '#45BCC8',
            },
          },
        },
        af: {
          field: {
            bg: 'white',
            boxShadow: '0px 3px 8px rgba(50, 50, 71, 0.05)',
            rounded: '6px',
            _focus: {
              boxShadow: '0 0 0 1px #45BCC8',
              borderColor: '#45BCC8',
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          _focus: {
            boxShadow: '0 0 0 1px #45BCC8',
            borderColor: '#45BCC8',
          },
        },
      },
    },
  },
}

const appTheme = extendTheme(theme)

export default appTheme

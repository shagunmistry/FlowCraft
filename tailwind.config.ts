import typographyPlugin from '@tailwindcss/typography'
import formsPlugin from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/lumina-code-frame/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        18: '4.5rem',
        112: '15rem',
        120: '20rem',
      },
      keyframes: {
        typing: {
          '0%': {
            width: '0%',
            visibility: 'hidden',
          },
          '100%': {
            width: '100%',
          },
        },
        blink: {
          '50%': {
            borderColor: 'transparent',
          },
          '100%': {
            borderColor: 'black',
          },
        },
      },
      animation: {
        typing: 'typing 2s steps(20) infinite alternate, blink .7s infinite',
      },
    },
  },
  plugins: [
    typographyPlugin,
    formsPlugin,
    tailwindTypography,
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config

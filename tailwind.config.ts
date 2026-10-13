import typographyPlugin from '@tailwindcss/typography'
import formsPlugin from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/lumina-code-frame/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', ...defaultTheme.fontFamily.sans],
        serif: ['Satoshi', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        graphite: 'rgb(var(--color-graphite) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        signal: 'rgb(var(--color-signal) / <alpha-value>)',
        fog: 'rgb(var(--color-fog) / <alpha-value>)',
        rule: 'rgb(var(--color-rule) / var(--color-rule-alpha, 0.08))',
      },
      borderRadius: {
        sm: '0.5rem',
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(rgb(var(--color-dot) / var(--color-dot-alpha, 0.08)) 1px, transparent 1px)',
        'dot-grid-dark':
          'radial-gradient(rgb(var(--color-dot) / 0.12) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-24': '24px 24px',
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
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'attention-glow': {
          '0%,100%': { boxShadow: '0 0 0 0 rgb(var(--color-signal) / 0.55), 0 24px 60px -30px rgba(16,18,22,0.25)' },
          '50%': { boxShadow: '0 0 0 10px rgb(var(--color-signal) / 0), 0 24px 60px -30px rgba(16,18,22,0.25)' },
        },
        tick: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        typing: 'typing 2s steps(20) infinite alternate, blink .7s infinite',
        scan: 'scan 3.5s linear infinite',
        tick: 'tick 1.4s ease-in-out infinite',
        'attention-glow': 'attention-glow 2.2s ease-in-out infinite',
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

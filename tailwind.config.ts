import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: '12px',
        md: '10px',
        sm: '8px'
      },
      letterSpacing: {
        financial: '-0.02em',
        label: '0.06em'
      },
      lineHeight: {
        heading: '1.2',
        body: '1.6'
      },
      keyframes: {
        stepFadeSlide: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'step-enter': 'stepFadeSlide 220ms cubic-bezier(0.4, 0, 0.2, 1) both'
      }
    }
  },
  plugins: [animate]
}

export default config

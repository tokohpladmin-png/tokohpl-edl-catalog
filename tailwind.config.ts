import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        varindo: {
          cream: '#f8f4ee',
          paper: '#fffaf3',
          ink: '#181411',
          muted: '#70675f',
          line: '#e8ded2',
          gold: '#b88746',
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          900: '#7c2d12'
        }
      },
      boxShadow: {
        luxury: '0 24px 80px rgba(28, 25, 23, 0.10)',
        card: '0 18px 55px rgba(28, 25, 23, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;

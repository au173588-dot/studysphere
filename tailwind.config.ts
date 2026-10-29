import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1E47',
          deep: '#0F265C',
          royal: '#1D4ED8',
          blue: '#2563EB',
          sky: '#38BDF8',
          soft: '#EEF3FA',
          surface: '#FFFFFF',
          canvas: '#F8FAFC',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(11, 30, 71, 0.05), 0 8px 24px -8px rgba(11, 30, 71, 0.06)',
        'card-hover': '0 4px 12px rgba(11, 30, 71, 0.08), 0 16px 32px -8px rgba(29, 78, 216, 0.12)',
        search: '0 2px 8px rgba(11, 30, 71, 0.06), 0 12px 28px -8px rgba(11, 30, 71, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;

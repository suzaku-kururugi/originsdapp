import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'secondary': "rgb(47 63 85)"
      },
      boxShadow: {
        'custom': '1px 1px 4px -1px rgba(0, 0, 0, 0.3)'
      },
      colors: {
        'theme-shadow': '#4a4aac',
        'text-primary': '#3C312B'
      },
      fontFamily: {
        "poppins": ["Poppins"],
        "mrDafoe": ["Mr Dafoe"]
      },
    },
  },
  plugins: [],
}
export default config

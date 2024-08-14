/** @type {import('tailwindcss').Config} */
import projectConfig from './src/docuflow.config';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...projectConfig.theme
      }
    },
  },
  plugins: [],
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './index.html',
  ]
}
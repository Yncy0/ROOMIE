/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {},
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        righteous: ["Righteous", "sans-serif"]
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}


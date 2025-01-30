/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
		animation: {
			'slide-in-left': 'slideInLeft 1s ease-out',
			'slide-in-right': 'slideInRight 1s ease-out',
		  },
		  keyframes: {
			slideInLeft: {
			  '0%': { transform: 'translateX(-100%)' },
			  '100%': { transform: 'translateX(0)' },
			},
			slideInRight: {
			  '0%': { transform: 'translateX(100%)' },
			  '100%': { transform: 'translateX(0)' },
			},
		  },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate"), require('tailwindcss-animated')],
}


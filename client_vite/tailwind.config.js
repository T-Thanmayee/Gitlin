/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		animation: {
  			'slide-in-left': 'slideInLeft 1s ease-out',
  			'slide-in-right': 'slideInRight 1s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			 'typing': "typing 2s steps(20) 1 alternate, blink .7s 1"
  		},
  		keyframes: {
  			slideInLeft: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
			  typing: {
				"0%": {
				  width: "0%",
				  visibility: "hidden"
				},
				"100%": {
				  width: "100%"
				}  
			  },
			  blink: {
				"50%": {
				  borderColor: "transparent"
				},
				"100%": {
				  borderColor: "white"
				}  
			  },
  			slideInRight: {
  				'0%': {
  					transform: 'translateX(100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
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


/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			transitionProperty: {
				'height': 'height',
			},
			keyframes: {
				'bg-zoom-loop': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.1)'
					}
				},
				arrowWiggle: {
					'0%, 100%': { transform: 'rotate(35deg) scale(1)' },
					'25%': { transform: 'rotate(30deg) scale(1.05)' },
					'50%': { transform: 'rotate(35deg) scale(1)' },
					'75%': { transform: 'rotate(40deg) scale(1.05)' },
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(0deg) scale(1)' },
					'25%': { transform: 'rotate(5deg) scale(1.05)' },
					'50%': { transform: 'rotate(0deg) scale(1)' },
					'75%': { transform: 'rotate(-5deg) scale(1.05)' },
				},
				flowDash: {
					'from': {
						'stroke-dashoffset': '20'
					},
					'to': {
						'stroke-dashoffset': '0'
					}
				},
				breath: {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.2)'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				shake: {
					'0%': { transform: 'rotate(5deg) scale(1)' },
					'15%': { transform: 'rotate(-5deg) scale(1.05)' },
					'30%': { transform: 'rotate(5deg) scale(1)' },
					'45%': { transform: 'rotate(-5deg) scale(1)' },
					'60%': { transform: 'rotate(5deg) scale(1.05)' },
					'75%': { transform: 'rotate(-5deg) scale(1)' },
					'90%': { transform: 'rotate(5deg) scale(1)' },
				},
			},
			animation: {
				'bg-zoom-loop': 'bg-zoom-loop 15s ease-in-out infinite',
				arrowWiggle: 'arrowWiggle 1s ease-in-out infinite',
				wiggle: 'wiggle 1s ease-in-out infinite',
				flow: 'flowDash 1s linear infinite',
				breath: 'breath 1.5s ease-in-out infinite',
				shake: 'shake 0.7s ease-in-out',
				float: 'float 2s ease-in-out infinite',
			},
			colors: {
				'custom-bg': '#2D2622',
				'custom-bg-text': '#61523A',
				'custom-green': '#7FA147',
				'custom-gray': '#5A5A5A',
				'custom-red': '#A74A39',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
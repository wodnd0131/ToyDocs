import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// 커스텀 프로젝트 색상
				github: {
					dark: '#0d1117',
					darkSecondary: '#161b22',
					border: '#30363d',
					blue: '#1f6feb',
					green: '#238636',
					orange: '#db6d28',
					red: '#da3633'
				},
				toss: {
					blue: '#3182f6',
					darkBlue: '#1e40af',
					lightBlue: '#dbeafe',
					gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
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
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-left': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'type-writer': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				'pulse-blue': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(49, 130, 246, 0.7)'
					},
					'50%': {
						boxShadow: '0 0 0 10px rgba(49, 130, 246, 0)'
					}
				},
				'issue-register-fade': {
					'0%': { backgroundColor: '#161b22', opacity: '1' },
					'20%': { backgroundColor: '#FFECB3', opacity: '1' },
					'100%': { backgroundColor: '#FFECB3', opacity: '0', height: '0px', padding: '0px' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in-left': 'slide-in-left 0.5s ease-out',
				'type-writer': 'type-writer 2s steps(20) infinite',
				'pulse-blue': 'pulse-blue 2s infinite',
				'issue-register-fade': 'issue-register-fade 3.5s forwards'
			},
			backgroundImage: {
				'gradient-toss': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				'gradient-github': 'linear-gradient(135deg, #1f6feb 0%, #238636 100%)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
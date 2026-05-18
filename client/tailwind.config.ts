import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Gabbar Sports brand tokens
        brand: {
          blue: '#00B4FF',
          'blue-dark': '#0090DD',
          green: '#39FF14',
          'green-dark': '#22CC00',
          orange: '#FF6B00',
          'orange-dark': '#E05500',
          navy: '#050B1A',
          'navy-light': '#0A1628',
          'navy-card': '#0D1E38',
        },
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00B4FF 0%, #39FF14 100%)',
        'gradient-hero': 'linear-gradient(180deg, #050B1A 0%, #0A1628 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(13,30,56,0.8) 0%, rgba(5,11,26,0.95) 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FF6B00 0%, #FF9500 100%)',
      },
      boxShadow: {
        'brand-blue': '0 4px 24px rgba(0,180,255,0.25)',
        'brand-green': '0 4px 24px rgba(57,255,20,0.25)',
        'brand-orange': '0 4px 24px rgba(255,107,0,0.25)',
        'glass': '0 8px 32px rgba(0,0,0,0.08)',
        'card': '0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.12)',
        'hero-image': '0 24px 80px rgba(0,0,0,0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-brand': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,180,255,0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0,180,255,0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-brand': 'pulse-brand 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
}

export default config

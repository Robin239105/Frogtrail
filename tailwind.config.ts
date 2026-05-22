import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fog: '#0e121c',
        surface: '#111827',
        'surface-raised': '#1a2234',
        'surface-hover': '#1f2a3d',
        accent: '#1D9E75',
        'accent-light': 'rgba(29, 158, 117, 0.15)',
        'accent-hover': '#16876A',
        danger: '#e24b4a',
        warning: '#ef9f27',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'count-up': 'countUp 0.8s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(29, 158, 117, 0.3)' },
          '50%': { boxShadow: '0 0 0 8px rgba(29, 158, 117, 0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;

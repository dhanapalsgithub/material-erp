import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { brand: { 600: '#0f766e', 700: '#115e59' } } } }, plugins: [] } satisfies Config;

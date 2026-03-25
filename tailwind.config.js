/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Figma Venture CRM palette
        primary:   '#5B5BD6',   // indigo/violet CTA
        'primary-hover': '#4A4AC4',
        sidebar:   '#0F0F1A',   // near-black sidebar bg
        'sidebar-hover': '#1C1C2E',
        'sidebar-active': '#5B5BD6',
        surface:   '#FFFFFF',
        background:'#F4F5F7',
        border:    '#E5E7EB',
        'text-primary':   '#111827',
        'text-secondary': '#6B7280',
        'text-muted':     '#9CA3AF',
        'text-inverse':   '#FFFFFF',
        success:   '#10B981',
        warning:   '#F59E0B',
        danger:    '#EF4444',
        'badge-pending':   '#FEF3C7',
        'badge-pending-text': '#92400E',
        'badge-done':      '#D1FAE5',
        'badge-done-text': '#065F46',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['11px', '16px'],
        xs:    ['12px', '18px'],
        sm:    ['13px', '20px'],
        base:  ['14px', '22px'],
        md:    ['15px', '24px'],
        lg:    ['16px', '24px'],
        xl:    ['18px', '28px'],
        '2xl': ['20px', '30px'],
        '3xl': ['24px', '32px'],
        '4xl': ['28px', '36px'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.04)',
        dropdown: '0 10px 25px -5px rgba(0,0,0,.12), 0 4px 6px -2px rgba(0,0,0,.06)',
        sidebar: '2px 0 8px 0 rgba(0,0,0,.18)',
      },
      width: {
        sidebar: '200px',
        'sidebar-collapsed': '64px',
      },
    },
  },
  plugins: [],
};


import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px',
        '3xl': '1600px',
        '4xl': '1920px',
        '5xl': '2560px',
        '6xl': '3200px',
        '7xl': '3840px',
        '8xl': '7680px',
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
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        neonDark: {
          "primary": "#39ff14", // neon green
          "secondary": "#00eaff", // neon blue
          "accent": "#ff00cc", // neon pink
          "neutral": "#22223b",
          "base-100": "#18181b",
          "base-200": "#232347",
          "base-300": "#2d2d4d",
          "info": "#00fff7",
          "success": "#00ff85",
          "warning": "#fff700",
          "error": "#ff0059",
          "card": "#232347",
          "card-foreground": "#39ff14",
          "sidebar": "#18181b",
          "sidebar-foreground": "#39ff14",
          "text-primary": "#39ff14",
          "text-secondary": "#00eaff",
          "text-accent": "#ff00cc",
          "text-base": "#fff",
        },
        lightStrong: {
          "primary": "#2563eb", // strong blue
          "secondary": "#14b8a6", // strong teal
          "accent": "#f43f5e", // strong pink
          "neutral": "#f3f4f6",
          "base-100": "#fff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "info": "#2563eb",
          "success": "#22c55e",
          "warning": "#eab308",
          "error": "#ef4444",
          "card": "#fff",
          "card-foreground": "#2563eb",
          "sidebar": "#fff",
          "sidebar-foreground": "#2563eb",
          "text-primary": "#2563eb",
          "text-secondary": "#14b8a6",
          "text-accent": "#f43f5e",
          "text-base": "#22223b",
        }
      },
      "light",
      "dark",
      "cupcake",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter"
    ],
    darkTheme: "neonDark",
    base: true,
    styled: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    themeRoot: ":root"
  }
} satisfies Config;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // colors: {
      // 	background: 'hsl(var(--background))',
      // 	foreground: 'hsl(var(--foreground))',
      // 	card: {
      // 		DEFAULT: 'hsl(var(--card))',
      // 		foreground: 'hsl(var(--card-foreground))'
      // 	},
      // 	popover: {
      // 		DEFAULT: 'hsl(var(--popover))',
      // 		foreground: 'hsl(var(--popover-foreground))'
      // 	},
      // 	primary: {
      // 		DEFAULT: 'hsl(var(--primary))',
      // 		foreground: 'hsl(var(--primary-foreground))'
      // 	},
      // 	secondary: {
      // 		DEFAULT: 'hsl(var(--secondary))',
      // 		foreground: 'hsl(var(--secondary-foreground))'
      // 	},
      // 	muted: {
      // 		DEFAULT: 'hsl(var(--muted))',
      // 		foreground: 'hsl(var(--muted-foreground))'
      // 	},
      // 	accent: {
      // 		DEFAULT: 'hsl(var(--accent))',
      // 		foreground: 'hsl(var(--accent-foreground))'
      // 	},
      // 	destructive: {
      // 		DEFAULT: 'hsl(var(--destructive))',
      // 		foreground: 'hsl(var(--destructive-foreground))'
      // 	},
      // 	border: 'hsl(var(--border))',
      // 	input: 'hsl(var(--input))',
      // 	ring: 'hsl(var(--ring))',
      // 	chart: {
      // 		'1': 'hsl(var(--chart-1))',
      // 		'2': 'hsl(var(--chart-2))',
      // 		'3': 'hsl(var(--chart-3))',
      // 		'4': 'hsl(var(--chart-4))',
      // 		'5': 'hsl(var(--chart-5))'
      // 	}
      // }
      colors: {
        // custom colors

        primary: {
          DEFAULT: "hsl(var(--primary))",
          background: "hsl(var(--primary-background))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        heading: "hsl(var(--heading))",
        subheading: "hsl(var(--subheading))",
        gray: "hsl(var(--gray))",
        date: "hsl(var(--date))",
        border: "hsl(var(--border))",
        "border-hover": "hsl(var(--border-hover))",
        error: "#DC2626",
        "error-foreground": "#FFECEC",
        plain: "hsl(var(--plain))",
        caption: "hsl(var(--caption))",
        active: "hsl(var(--active))",
        inactive: "hsl(var(--inactive))",

        // default colors

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--gray))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        hover: "hsl(var(--hover))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

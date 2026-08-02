import type { Config } from "tailwindcss";

/**
 * The marketing site keeps its own colour list rather than importing the app's
 * brand tokens. Values match `client/src/lib/brand/tokens.ts` exactly; the
 * duplication is deliberate so a token change cannot force an unrelated rebuild
 * and redeploy of the live marketing site.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#2599F6",
        "brand-d": "#1A80D8",
        "brand-l": "#60B8FA",
        navy: "#07091A",
        surface: "#0C1121",
        card: "#111830",
        card2: "#18223C",
        surface2: "#111827",
        muted: "#7A8FB8",
        gold: "#F5A623",
        green: "#22C55E",
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "Inter Fallback", "system-ui", "sans-serif"],
      },
    },
  },
};

export default config;

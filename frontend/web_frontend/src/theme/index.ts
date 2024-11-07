import { extendTheme, ThemeConfig, withDefaultColorScheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const customTheme = extendTheme(
  {
    config,
    colors: {
      brand: {
        50: "#f9f5e8",    // Lightest shade
        100: "#f2e7bf",
        200: "#d4af37",   // Default color?
        300: "#e4ca69",
        400: "#debc40",
        500: "#d4af37",    // Base shade (Metallic Gold)
        600: "#c3992e",
        700: "#b38426",
        800: "#a16f1d",
        900: "#7e5515",    // Darkest shade
      },
      black: "#000000",
      brightGold: "#FFC904", // UCF Bright Gold color
    },
    styles: {
      global: {
        "html, body": {
          backgroundColor: "black",
          color: "whiteAlpha.900",
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default customTheme;

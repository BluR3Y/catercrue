import type { Preview } from '@storybook/react'
// import StyledGlobal from "../src/app/global.styles";
// import StyledTheme from "../src/app/theme.styled";
import { ThemeConte }
import { withThemeFromJSXProvider } from "@storybook/addon-themes";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeFromJSXProvider({
      Provider: StyledTheme,
      GlobalStyles: StyledGlobal
    })
  ]
};

export default preview;
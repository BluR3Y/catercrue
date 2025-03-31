import type { Preview } from '@storybook/react'
import { ThemeWrapper } from "../src/components/ThemeWrapper";
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
      Provider: ThemeWrapper
    })
  ]
};

export default preview;
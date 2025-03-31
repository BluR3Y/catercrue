import { createGlobalStyle } from "styled-components";

const themes = {
  light: {
      colors: {
          primary: '#FF5733',
          secondary: '#385ddf',
          accent: '#41495a',
          text: '#121212',
          background: '#fbfbfc',
          container: '#ffffff'
      }
  },
  dark: {
      colors: {
          primary: '#FF5733',
          secondary: '#385ddf',
          accent: '#02111b',
          text: '#b39999',
          background: '#202731',
          container: '#2a3647'
      },
  }
};
export default themes;

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Inter', sans-serif;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
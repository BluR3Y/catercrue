'use client'

import React from "react";
import { ThemeProvider } from "styled-components";

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
  }

export default function({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <ThemeProvider theme={themes['dark']}>{children}</ThemeProvider>
    );
}
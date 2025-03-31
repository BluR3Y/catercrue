'use client';

import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import Themes, { GlobalStyles } from "./ThemeContext.styles";
import { IThemeContext, ThemeName } from "./ThemeContext.types";

export default function({
    children
}: IThemeContext) {
    const [activeTheme, setActiveTheme] = useState<ThemeName>('dark');

    return (
        <ThemeProvider
        theme={Themes[activeTheme]}
        >
            <GlobalStyles/>
            {children}
        </ThemeProvider>
    )
}
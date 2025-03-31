'use client';

import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import themes, { GlobalStyles } from "./ThemeWrapper.styles";
import { IThemeWrapper, ThemeName } from "./ThemeWrapper.types";

export default function({
    children
}: IThemeWrapper) {
    const [activeTheme, setActiveTheme] = useState<ThemeName>('dark');

    return (
        <ThemeProvider
        theme={themes[activeTheme]}
        >
            <GlobalStyles/>
            {children}
        </ThemeProvider>
    );
}
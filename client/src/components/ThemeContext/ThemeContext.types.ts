import React from "react";

export type ThemeName = 'light' | 'dark';

export interface IThemeContext {
    children: React.ReactNode;
}
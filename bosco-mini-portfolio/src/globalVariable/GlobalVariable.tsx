export const colorTheme = {
    theme: 'theme',
    light: 'light',
    dark: 'dark',
}

export const loaderThemeColor = {
    light: '#0B1A33',
    dark: '#4094F4',
}

export const getLoaderColor = (theme: string) => {
    return theme === colorTheme.dark ? loaderThemeColor.dark : loaderThemeColor.light;
}

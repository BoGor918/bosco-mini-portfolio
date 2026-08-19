import { color } from './colorPalette';

export const colorTheme = {
    theme: 'theme',
    light: 'light',
    dark: 'dark',
}

export { color };

export const getLoaderColor = (theme: string) => {
    return theme === colorTheme.dark ? color.lightBlue : color.darkBlue;
}

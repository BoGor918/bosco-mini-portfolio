export type DashboardModalType = {
    closeModal: () => void;
    onSavingChange?: (isSaving: boolean) => void;
};

export type Locale = 'en' | 'zh' | 'cn';

export const localeTabs: Array<{ value: Locale; label: string }> = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: 'Traditional Chinese' },
    { value: 'cn', label: 'Simplified Chinese' },
];

export const getDashboardInputStyles = (isDarkTheme: boolean) => ({
    label: {
        color: isDarkTheme ? '#FFFFFF' : '#334155',
        fontWeight: 600,
        fontSize: '14px',
    },
    input: {
        backgroundColor: isDarkTheme ? '#102340' : '#FFFFFF',
        color: isDarkTheme ? '#FFFFFF' : '#0B1A33',
        borderColor: isDarkTheme ? 'rgba(33, 212, 247, 0.45)' : 'rgba(11, 26, 51, 0.25)',
        fontSize: '14px',
    },
});

export const getDashboardTabsStyles = (isDarkTheme: boolean) => ({
    tab: {
        color: isDarkTheme ? '#FFFFFF' : '#334155',
    },
});
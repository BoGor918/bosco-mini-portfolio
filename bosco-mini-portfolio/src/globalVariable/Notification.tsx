// icon
import { CheckIcon, XIcon } from '@phosphor-icons/react';
// mantine
import { notifications } from '@mantine/notifications';
// translation
import { languageSetting, translations, translationKeys } from './Translation';

export const showNotification = (
    message: string,
    type: 'success' | 'error',
) => {
    const storedLanguage = localStorage.getItem(languageSetting.key);
    const language = storedLanguage === languageSetting.traditionalChinese || storedLanguage === languageSetting.simplifiedChinese
        ? storedLanguage
        : languageSetting.english;

    // icon
    const xIcon = <XIcon size={20} />;
    const checkIcon = <CheckIcon size={20} />;

    notifications.show({
        title: translations[language][type === 'success' ? translationKeys.notificationSuccess : translationKeys.notificationError],
        message: message,
        icon: type === 'success' ? checkIcon : xIcon,
        color: type === 'success' ? 'teal' : 'red',
    });
};
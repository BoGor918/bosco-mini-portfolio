// icon
import { CheckIcon, XIcon } from '@phosphor-icons/react';
// mantine
import { notifications } from '@mantine/notifications';
// translation
import { languageSetting, translations, translationKeys } from './Translation';
// types
import type { NotificationType } from '../types/type';

export const NotificationSuccess = 'success';
export const NotificationError = 'error';

export const showNotification = (
    message: string,
    type: NotificationType,
) => {
    const storedLanguage = localStorage.getItem(languageSetting.key);
    const language = storedLanguage === languageSetting.traditionalChinese || storedLanguage === languageSetting.simplifiedChinese
        ? storedLanguage
        : languageSetting.english;

    // icon
    const xIcon = <XIcon size={20} />;
    const checkIcon = <CheckIcon size={20} />;

    notifications.show({
        title: translations[language][type === NotificationSuccess ? translationKeys.notificationSuccess : translationKeys.notificationError],
        message: message,
        icon: type === NotificationSuccess ? checkIcon : xIcon,
        color: type === NotificationSuccess ? 'teal' : 'red',
    });
};
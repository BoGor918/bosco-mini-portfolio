// icon
import { CheckIcon, XIcon } from '@phosphor-icons/react';
// mantine
import { notifications } from '@mantine/notifications';

export const showNotification = (
    message: string,
    type: 'success' | 'error',
) => {
    // icon
    const xIcon = <XIcon size={20} />;
    const checkIcon = <CheckIcon size={20} />;

    notifications.show({
        title: type === 'success' ? 'Success' : 'Error',
        message: message,
        icon: type === 'success' ? checkIcon : xIcon,
        color: type === 'success' ? 'teal' : 'red',
    });
};
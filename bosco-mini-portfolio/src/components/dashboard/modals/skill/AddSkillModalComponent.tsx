// react
import { useContext, useState } from 'react';
// mantine
import { TextInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../../globalVariable/MapperContextProvider';
import { showNotification } from '../../../../globalVariable/Notification';
import { translationKeys } from '../../../../globalVariable/Translation';
// util
import { convertFileToBase64, generateId } from '../../../util';
import { DashboardImageFileInput, DashboardModalType, DashboardSubmitButton, ErrorNotificationType, getDashboardInputStyles, SuccessNotificationType, useDashboardSavingEffect } from '../util';
// query
import { saveSkillDocument } from '../../../../query/SkillQuery';

type SkillFormFields = {
    skillName: string;
    logo: File | null;
};

type SubmitHandler = SkillFormFields;

export default function AddSkillModalComponent({ closeModal, onSavingChange }: DashboardModalType) {
    const [isSaving, setIsSaving] = useState(false);

    useDashboardSavingEffect(isSaving, onSavingChange);

    // form
    const form = useForm<SubmitHandler>({
        mode: 'uncontrolled',
        initialValues: {
            skillName: '',
            logo: null,
        },
        validate: {
            skillName: (value) => (value.trim().length === 0 ? `${t(translationKeys.skillName)}${t(translationKeys.isRequired)}` : null),
            logo: (value) => (value === null ? `${t(translationKeys.logo)}${t(translationKeys.isRequired)}` : null),
        },
    });
    // context
    const { t, theme } = useContext(MapperContext);
    // color theme
    const isDarkTheme = theme === colorTheme.dark;

    // style list
    const inputStyles = getDashboardInputStyles(isDarkTheme);

    const onSubmit = async (values: SubmitHandler) => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const base64Logo = values.logo ? await convertFileToBase64(values.logo) : null;

            await saveSkillDocument(generateId(values.skillName), {
                SkillName: values.skillName,
                Logo: base64Logo,
                CreateDate: new Date(),
            });

            form.reset();
            closeModal();
            showNotification(`${t(translationKeys.skill)}${t(translationKeys.savedSuccessfully)}`, SuccessNotificationType);
        } catch (error) {
            console.error(`${t(translationKeys.failedToSubmit)}${t(translationKeys.skill)}`, error);
            showNotification(`${t(translationKeys.failedToSubmit)}${t(translationKeys.skill)}`, ErrorNotificationType);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative">
            <LoadingOverlay
                visible={isSaving}
                zIndex={1000}
                overlayProps={{
                    radius: 'sm',
                    blur: 1.5,
                    backgroundOpacity: 0.35,
                    color: isDarkTheme ? '#0B1A33' : '#334155',
                }}
            />
            {/* form */}
            <form key={"skillForm"} onSubmit={form.onSubmit(onSubmit)}>
                <TextInput
                    className="w-full"
                    withAsterisk
                    label={t(translationKeys.skill)}
                    key={form.key('skillName')}
                    styles={inputStyles}
                    disabled={isSaving}
                    {...form.getInputProps('skillName')}
                />
                <DashboardImageFileInput
                    inputStyles={inputStyles}
                    componentKey={form.key('logo')}
                    disabled={isSaving}
                    inputProps={form.getInputProps('logo')}
                    label={t(translationKeys.uploadFile)}
                />
                <DashboardSubmitButton isSaving={isSaving} showLoading />
            </form>
        </div>
    );
}

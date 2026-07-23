// react
import { useContext, useState } from 'react';
// mantine
import { TextInput, MultiSelect, TagsInput } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../../globalVariable/Translation';
import { showNotification } from '../../../../globalVariable/Notification';
// util
import { convertFileToBase64, generateId } from '../../../util';
import { DashboardImageFileInput, DashboardLocaleTextTabs, DashboardModalType, DashboardSubmitButton, ErrorNotificationType, Locale, SuccessNotificationType, getDashboardInputStyles, getDashboardTabsStyles, useDashboardSavingEffect } from '../util';
// query
import { saveProjectDocument } from '../../../../query/ProjectQuery';


type ProjectFormFields = {
    description: string;
};

type SubmitHandler = Record<Locale, ProjectFormFields> & {
    projectName: string;
    techStack: string[],
    link: string[],
    logo: File | null,
};

const formWithLanguageFieldKeys: Array<keyof ProjectFormFields> = [
    'description',
];

export default function AddProjectModalComponent({ closeModal, onSavingChange }: DashboardModalType) {
    // form
    const form = useForm<SubmitHandler>({
        mode: 'controlled',
        initialValues: {
            projectName: '',
            en: {
                description: '',
            },
            zh: {
                description: '',
            },
            cn: {
                description: '',
            },
            techStack: [],
            link: [],
            logo: null,
        },
        validate: {
            en: {
                description: (value) => (value.trim().length === 0 ? `${t(translationKeys.description)}${t(translationKeys.isRequired)}` : null),
            },
            zh: {
                description: (value) => (value.trim().length === 0 ? `${t(translationKeys.description)}${t(translationKeys.isRequired)}` : null),
            },
            cn: {
                description: (value) => (value.trim().length === 0 ? `${t(translationKeys.description)}${t(translationKeys.isRequired)}` : null),
            },
            projectName: (value) => (value.trim().length === 0 ? `${t(translationKeys.projectName)}${t(translationKeys.isRequired)}` : null),
            techStack: (value) => (value.length === 0 ? `${t(translationKeys.atLeastOneTechStack)}${t(translationKeys.isRequired)}` : null),
            link: (value) => (value.length === 0 ? `${t(translationKeys.atLeastOneLink)}${t(translationKeys.isRequired)}` : null),
            logo: (value) => (value === null ? `${t(translationKeys.logo)}${t(translationKeys.isRequired)}` : null),
        },
    });
    // context
    const { t, theme, skillData } = useContext(MapperContext);
    // color theme
    const isDarkTheme = theme === colorTheme.dark;
    const [isSaving, setIsSaving] = useState(false);

    // style list
    const inputStyles = getDashboardInputStyles(isDarkTheme);
    const tabsStyles = getDashboardTabsStyles(isDarkTheme);

    useDashboardSavingEffect(isSaving, onSavingChange);

    const onSubmit = async (values: SubmitHandler) => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const base64Logo = values.logo ? await convertFileToBase64(values.logo) : null;

            await saveProjectDocument(generateId(values.projectName), {
                en: {
                    Description: values.en.description,
                },
                zh: {
                    Description: values.zh.description,
                },
                cn: {
                    Description: values.cn.description,
                },
                ProjectName: values.projectName,
                Logo: base64Logo,
                TechStack: values.techStack,
                Link: values.link,
                CreateDate: new Date(),
            });

            form.reset();
            closeModal();
            showNotification(`${t(translationKeys.project)}${t(translationKeys.savedSuccessfully)}`, SuccessNotificationType);
        } catch (error) {
            console.error(`${t(translationKeys.failedToSubmit)}${t(translationKeys.project)}`, error);
            showNotification(`${t(translationKeys.failedToSubmit)}${t(translationKeys.project)}`, ErrorNotificationType);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            {/* form */}
            <form key={"projectForm"} onSubmit={form.onSubmit(onSubmit)}>
                <DashboardLocaleTextTabs
                    tabsStyles={tabsStyles}
                    fieldKeys={formWithLanguageFieldKeys as string[]}
                    inputStyles={inputStyles}
                    disabled={isSaving}
                    getInputProps={(path) => form.getInputProps(path)}
                    getFieldLabel={(fieldKey, locale) => `${t(translationKeys[fieldKey as keyof typeof translationKeys])} (${locale})`}
                />
                <TextInput
                    className="w-full mt-2"
                    withAsterisk
                    label={t(translationKeys.projectName)}
                    key={form.key('projectName')}
                    styles={inputStyles}
                    disabled={isSaving}
                    {...form.getInputProps('projectName')}
                />
                <MultiSelect
                    label={t(translationKeys.techStack)}
                    withAsterisk
                    data={skillData.map(skill => skill.SkillName)}
                    clearable
                    searchable
                    styles={inputStyles}
                    className="mt-2"
                    disabled={isSaving}
                    key={form.key('techStack')}
                    {...form.getInputProps('techStack')}
                />
                <TagsInput
                    label={t(translationKeys.link)}
                    withAsterisk
                    styles={inputStyles}
                    className="mt-2"
                    disabled={isSaving}
                    clearable
                    acceptValueOnBlur
                    splitChars={[',']}
                    key={form.key('link')}
                    {...form.getInputProps('link')}
                />
                <DashboardImageFileInput
                    inputStyles={inputStyles}
                    componentKey={form.key('logo')}
                    disabled={isSaving}
                    inputProps={form.getInputProps('logo')}
                    label={t(translationKeys.uploadFile)}
                />
                <DashboardSubmitButton isSaving={isSaving} />
            </form>
        </div>
    );
}

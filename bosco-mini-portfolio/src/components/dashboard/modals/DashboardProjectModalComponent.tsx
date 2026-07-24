// react
import { useContext, useEffect, useRef, useState } from 'react';
// mantine
import { TextInput, MultiSelect, TagsInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../globalVariable/Translation';
import { showNotification } from '../../../globalVariable/Notification';
// util
import { convertFileToBase64, generateId, normalizeImageSource } from '../../util';
import { DashboardExistingImagePreview, DashboardImageFileInput, DashboardLocaleTextTabs, DashboardModalType, DashboardSubmitDeleteButtonGroup, ErrorNotificationType, Locale, SuccessNotificationType, getDashboardInputStyles, getDashboardTabsStyles, useDashboardSavingEffect } from './util';
// query
import { saveProjectDocument } from '../../../query/ProjectQuery';
// type
import { ProjectData } from '../../../types/type';

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

type ProjectModalMode = 'create' | 'edit';

type ProjectModalProps = DashboardModalType & {
    mode?: ProjectModalMode;
    initialProject?: ProjectData | null;
    onDeleteRequest?: () => void;
};

const getInitialValues = (): SubmitHandler => ({
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
});

export default function DashboardProjectModalComponent({
    closeModal,
    onSavingChange,
    onDirtyChange,
    readOnly = false,
    mode = 'create',
    initialProject = null,
    onDeleteRequest,
}: ProjectModalProps) {
    // context
    const { t, theme, skillData } = useContext(MapperContext);
    // modal mode
    const isEditMode = mode === 'edit' && initialProject !== null;
    // button text
    const buttonText = isEditMode ? t(translationKeys.update) : t(translationKeys.submit);
    // saving state
    const [isSaving, setIsSaving] = useState(false);
     // validation hint state
    const [showValidationHint, setShowValidationHint] = useState(false);
    // form disabled state
    const isFormDisabled = isSaving || readOnly;
    // hydrated form key ref
    const hydratedFormKeyRef = useRef<string>('');
    // form
    const form = useForm<SubmitHandler>({
        mode: 'controlled',
        initialValues: getInitialValues(),
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
            logo: (value) => {
                if (value !== null) {
                    return null;
                }
                if (isEditMode && initialProject?.Logo) {
                    return null;
                }
                return `${t(translationKeys.logo)}${t(translationKeys.isRequired)}`;
            },
        },
    });

    // style list
    const inputStyles = getDashboardInputStyles(theme === colorTheme.dark);
    const tabsStyles = getDashboardTabsStyles(theme === colorTheme.dark);

    // saving effect
    useDashboardSavingEffect(isSaving, onSavingChange);

    // dirty effect
    useEffect(() => {
        onDirtyChange?.(isEditMode && !readOnly ? form.isDirty() : false);
    }, [form, form.values, isEditMode, onDirtyChange, readOnly]);

    useEffect(() => {
        if (!showValidationHint) {
            return;
        }

        if (Object.keys(form.errors).length === 0) {
            setShowValidationHint(false);
        }
    }, [form.errors, showValidationHint]);

    // hydrate form values effect
    useEffect(() => {
        const hydrationKey = isEditMode && initialProject ? `edit:${initialProject.id}` : 'create';

        if (hydratedFormKeyRef.current === hydrationKey) {
            return;
        }

        hydratedFormKeyRef.current = hydrationKey;

        if (isEditMode && initialProject) {
            form.setValues({
                en: {
                    description: initialProject.en.Description,
                },
                zh: {
                    description: initialProject.zh.Description,
                },
                cn: {
                    description: initialProject.cn.Description,
                },
                projectName: initialProject.ProjectName,
                techStack: initialProject.TechStack,
                link: initialProject.Link,
                logo: null,
            });
            form.resetDirty();
            form.clearErrors();
            form.resetTouched();
            setShowValidationHint(false);
            return;
        }

        form.setValues(getInitialValues());
        form.resetDirty();
        form.clearErrors();
        form.resetTouched();
        setShowValidationHint(false);
    }, [form, initialProject, isEditMode]);

    // submit handler
    const onSubmit = async (values: SubmitHandler) => {
        if (isSaving || readOnly) {
            return;
        }

        setShowValidationHint(false);
        setIsSaving(true);

        try {
            const base64Logo = values.logo
                ? await convertFileToBase64(values.logo)
                : isEditMode
                    ? initialProject?.Logo ?? null
                    : null;

            const targetDocumentId = isEditMode && initialProject
                ? initialProject.id
                : generateId(values.projectName);

            const createDate = isEditMode && initialProject
                ? new Date(initialProject.CreateDate.seconds * 1000)
                : new Date();

            await saveProjectDocument(targetDocumentId, {
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
                CreateDate: createDate,
            });

            form.reset();
            setShowValidationHint(false);
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
        <div className="relative">
            <LoadingOverlay
                visible={isSaving}
                zIndex={1000}
                overlayProps={{
                    radius: 'sm',
                    blur: 1.5,
                    backgroundOpacity: 0.35,
                    color: theme === colorTheme.dark ? '#0B1A33' : '#334155',
                }}
            />
            {/* form */}
            <form
                key={"projectForm"}
                onSubmit={form.onSubmit(onSubmit, () => {
                    setShowValidationHint(true);
                })}
            >
                <DashboardLocaleTextTabs
                    tabsStyles={tabsStyles}
                    t={t}
                    fieldKeys={formWithLanguageFieldKeys as string[]}
                    inputStyles={inputStyles}
                    disabled={isFormDisabled}
                    getInputProps={(path) => form.getInputProps(path)}
                    getFieldLabel={(fieldKey, locale) => `${t(translationKeys[fieldKey as keyof typeof translationKeys])} (${locale})`}
                />
                <TextInput
                    className="w-full mt-2"
                    withAsterisk
                    label={t(translationKeys.projectName)}
                    key={form.key('projectName')}
                    styles={inputStyles}
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                    key={form.key('techStack')}
                    {...form.getInputProps('techStack')}
                />
                <TagsInput
                    label={t(translationKeys.link)}
                    withAsterisk
                    styles={inputStyles}
                    className="mt-2"
                    disabled={isFormDisabled}
                    clearable
                    acceptValueOnBlur
                    splitChars={[',']}
                    key={form.key('link')}
                    {...form.getInputProps('link')}
                />
                <DashboardImageFileInput
                    inputStyles={inputStyles}
                    componentKey={form.key('logo')}
                    disabled={isFormDisabled}
                    inputProps={form.getInputProps('logo')}
                    label={t(translationKeys.uploadFile)}
                />
                {(initialProject?.Logo || form.values.logo) && (
                    <DashboardExistingImagePreview
                        imageSource={form.values.logo ? form.values.logo : normalizeImageSource(initialProject?.Logo ?? '')}
                        alt="Project Logo"
                        label="Logo"
                        isDarkTheme={theme === colorTheme.dark}
                    />
                )}
                <DashboardSubmitDeleteButtonGroup
                    isSaving={isSaving}
                    disabled={readOnly}
                    idleText={buttonText}
                    deleteText={t(translationKeys.delete)}
                    showDelete={isEditMode}
                    onDeleteClick={onDeleteRequest}
                    validationMessage={showValidationHint ? t(translationKeys.pleaseFixHighlightedErrors) : undefined}
                />
            </form>
        </div>
    );
}

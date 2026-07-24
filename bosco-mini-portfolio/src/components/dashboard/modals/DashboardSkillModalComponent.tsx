// react
import { useContext, useEffect, useRef, useState } from 'react';
// mantine
import { TextInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { showNotification } from '../../../globalVariable/Notification';
import { translationKeys } from '../../../globalVariable/Translation';
// util
import { convertFileToBase64, generateId, normalizeImageSource } from '../../util';
import { DashboardExistingImagePreview, DashboardImageFileInput, DashboardModalType, DashboardSubmitDeleteButtonGroup, ErrorNotificationType, getDashboardInputStyles, SuccessNotificationType, useDashboardSavingEffect } from './util';
// query
import { saveSkillDocument } from '../../../query/SkillQuery';
// type
import { SkillData } from '../../../types/type';

type SkillFormFields = {
    skillName: string;
    logo: File | null;
};

type SubmitHandler = SkillFormFields;

type SkillModalMode = 'create' | 'edit';

type SkillModalProps = DashboardModalType & {
    mode?: SkillModalMode;
    initialSkill?: SkillData | null;
    onDeleteRequest?: () => void;
};

export default function DashboardSkillModalComponent({
    closeModal,
    onSavingChange,
    onDirtyChange,
    mode = 'create',
    initialSkill = null,
    onDeleteRequest,
}: SkillModalProps) {
    // context
    const { t, theme } = useContext(MapperContext);
    // modal mode
    const isEditMode = mode === 'edit' && initialSkill !== null;
    // button text
    const buttonText = isEditMode ? t(translationKeys.update) : t(translationKeys.submit);
    // saving state
    const [isSaving, setIsSaving] = useState(false);
    // hydrated form key ref
    const hydratedFormKeyRef = useRef<string>('');
    // form
    const form = useForm<SubmitHandler>({
        mode: 'controlled',
        initialValues: {
            skillName: '',
            logo: null,
        },
        validate: {
            skillName: (value) => (value.trim().length === 0 ? `${t(translationKeys.skillName)}${t(translationKeys.isRequired)}` : null),
            logo: (value) => {
                if (value !== null) {
                    return null;
                }
                if (isEditMode && initialSkill?.Logo) {
                    return null;
                }
                return `${t(translationKeys.logo)}${t(translationKeys.isRequired)}`;
            },
        },
    });

    // style list
    const inputStyles = getDashboardInputStyles(theme === colorTheme.dark);

    // saving effect
    useDashboardSavingEffect(isSaving, onSavingChange);

    // dirty effect
    useEffect(() => {
        onDirtyChange?.(isEditMode ? form.isDirty() : false);
    }, [form, form.values, isEditMode, onDirtyChange]);

    // hydrate form values when initialSkill changes
    useEffect(() => {
        const hydrationKey = isEditMode && initialSkill ? `edit:${String(initialSkill.id)}` : 'create';

        if (hydratedFormKeyRef.current === hydrationKey) {
            return;
        }

        hydratedFormKeyRef.current = hydrationKey;

        if (isEditMode && initialSkill) {
            form.setValues({
                skillName: initialSkill.SkillName,
                logo: null,
            });
            form.resetDirty();
            form.clearErrors();
            form.resetTouched();
            return;
        }

        form.setValues({
            skillName: '',
            logo: null,
        });
        form.resetDirty();
        form.clearErrors();
        form.resetTouched();
    }, [form, initialSkill, isEditMode]);

    // submit handler
    const onSubmit = async (values: SubmitHandler) => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const base64Logo = values.logo
                ? await convertFileToBase64(values.logo)
                : isEditMode
                    ? initialSkill?.Logo ?? null
                    : null;

            const targetDocumentId = isEditMode && initialSkill
                ? String(initialSkill.id)
                : generateId(values.skillName);

            const createDate = isEditMode && initialSkill
                ? new Date(initialSkill.CreateDate.seconds * 1000)
                : new Date();

            await saveSkillDocument(targetDocumentId, {
                SkillName: values.skillName,
                Logo: base64Logo,
                CreateDate: createDate,
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
                    color: theme === colorTheme.dark ? '#0B1A33' : '#334155',
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
                {(initialSkill?.Logo || form.values.logo) && (
                    <DashboardExistingImagePreview
                        imageSource={form.values.logo ? form.values.logo : normalizeImageSource(initialSkill?.Logo ?? '')}
                        alt="Skill Logo"
                        label="Logo"
                        isDarkTheme={theme === colorTheme.dark}
                    />
                )}
                <DashboardSubmitDeleteButtonGroup
                    isSaving={isSaving}
                    showLoading
                    idleText={buttonText}
                    deleteText={t(translationKeys.delete)}
                    showDelete={isEditMode}
                    onDeleteClick={onDeleteRequest}
                />
            </form>
        </div>
    );
}

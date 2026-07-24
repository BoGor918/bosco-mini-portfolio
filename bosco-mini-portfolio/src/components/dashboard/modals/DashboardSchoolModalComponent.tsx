// react
import { useContext, useEffect, useRef, useState } from 'react';
// mantine
import { LoadingOverlay, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../globalVariable/Translation';
import { showNotification } from '../../../globalVariable/Notification';
// util
import { DashboardDateRangeFields, DashboardExistingImagePreview, DashboardImageFileInput, DashboardLocaleTextTabs, DashboardModalType, DashboardPresentCheckbox, DashboardSubmitDeleteButtonGroup, ErrorNotificationType, Locale, SuccessNotificationType, getDashboardInputStyles, getDashboardTabsStyles, useDashboardSavingEffect, toDateFromTimestamp } from './util';
import { convertFileToBase64, generateId, normalizeImageSource, toDateOrNull } from '../../util';
// query
import { saveSchoolDocument } from '../../../query/SchoolQuery';
// type
import { SchoolData } from '../../../types/type';

type SchoolFormFields = {
    schoolName: string;
    type: string;
    title: string;
};

type SubmitHandler = Record<Locale, SchoolFormFields> & {
    present: boolean;
    logo: File | null;
    startDate: Date | null;
    endDate: Date | null;
    gpa: number;
};

const formWithLanguageFieldKeys: Array<keyof SchoolFormFields> = [
    'schoolName',
    'type',
    'title',
];

type SchoolModalMode = 'create' | 'edit';

type SchoolModalProps = DashboardModalType & {
    mode?: SchoolModalMode;
    initialSchool?: SchoolData | null;
    onDeleteRequest?: () => void;
};

const getInitialValues = (): SubmitHandler => ({
    en: {
        schoolName: '',
        type: '',
        title: '',
    },
    zh: {
        schoolName: '',
        type: '',
        title: '',
    },
    cn: {
        schoolName: '',
        type: '',
        title: '',
    },
    present: false,
    logo: null,
    startDate: null,
    endDate: null,
    gpa: 0,
});

const toNumberOrZero = (value: string | number) => {
    if (typeof value === 'number') {
        return Number.isNaN(value) ? 0 : value;
    }

    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export default function DashboardSchoolModalComponent({
    closeModal,
    onSavingChange,
    onDirtyChange,
    readOnly = false,
    mode = 'create',
    initialSchool = null,
    onDeleteRequest,
}: SchoolModalProps) {
    // context
    const { t, theme } = useContext(MapperContext);
    // modal mode
    const isEditMode = mode === 'edit' && initialSchool !== null;
    // button text
    const buttonText = isEditMode ? t(translationKeys.update) : t(translationKeys.submit);
    // saving state
    const [isSaving, setIsSaving] = useState(false);
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
                schoolName: (value) => (value.trim().length === 0 ? `${t(translationKeys.schoolName)}${t(translationKeys.isRequired)}` : null),
                type: (value) => (value.trim().length === 0 ? `${t(translationKeys.type)}${t(translationKeys.isRequired)}` : null),
                title: (value) => (value.trim().length === 0 ? `${t(translationKeys.title)}${t(translationKeys.isRequired)}` : null),
            },
            zh: {
                schoolName: (value) => (value.trim().length === 0 ? `${t(translationKeys.schoolName)}${t(translationKeys.isRequired)}` : null),
                type: (value) => (value.trim().length === 0 ? `${t(translationKeys.type)}${t(translationKeys.isRequired)}` : null),
                title: (value) => (value.trim().length === 0 ? `${t(translationKeys.title)}${t(translationKeys.isRequired)}` : null),
            },
            cn: {
                schoolName: (value) => (value.trim().length === 0 ? `${t(translationKeys.schoolName)}${t(translationKeys.isRequired)}` : null),
                type: (value) => (value.trim().length === 0 ? `${t(translationKeys.type)}${t(translationKeys.isRequired)}` : null),
                title: (value) => (value.trim().length === 0 ? `${t(translationKeys.title)}${t(translationKeys.isRequired)}` : null),
            },
            logo: (value) => {
                if (value !== null) {
                    return null;
                }
                if (isEditMode && initialSchool?.Logo) {
                    return null;
                }
                return `${t(translationKeys.logo)}${t(translationKeys.isRequired)}`;
            },
            startDate: (value) => (value === null ? `${t(translationKeys.startDate)}${t(translationKeys.isRequired)}` : null),
            endDate: (value, values) => {
                if (!values.present && value === null) {
                    return `${t(translationKeys.endDate)}${t(translationKeys.isRequired)}`;
                }
                return null;
            },
        },
    });

    // style list
    const inputStyles = getDashboardInputStyles(theme === colorTheme.dark);
    const tabsStyles = getDashboardTabsStyles(theme === colorTheme.dark);
    const numberInputStyles = {
        ...inputStyles,
        control: {
            color: theme === colorTheme.dark ? '#FFFFFF' : '#0B1A33',
            borderColor: theme === colorTheme.dark ? 'rgba(33, 212, 247, 0.45)' : 'rgba(11, 26, 51, 0.25)',
        },
    };

    // saving effect
    useDashboardSavingEffect(isSaving, onSavingChange);

    // dirty effect
    useEffect(() => {
        onDirtyChange?.(isEditMode && !readOnly ? form.isDirty() : false);
    }, [form, form.values, isEditMode, onDirtyChange, readOnly]);

    // hydrate form values when initialSchool changes
    useEffect(() => {
        const hydrationKey = isEditMode && initialSchool ? `edit:${initialSchool.id}` : 'create';

        if (hydratedFormKeyRef.current === hydrationKey) {
            return;
        }

        hydratedFormKeyRef.current = hydrationKey;

        if (isEditMode && initialSchool) {
            form.setValues({
                en: {
                    schoolName: initialSchool.en.SchoolName,
                    type: initialSchool.en.Type,
                    title: initialSchool.en.Title,
                },
                zh: {
                    schoolName: initialSchool.zh.SchoolName,
                    type: initialSchool.zh.Type,
                    title: initialSchool.zh.Title,
                },
                cn: {
                    schoolName: initialSchool.cn.SchoolName,
                    type: initialSchool.cn.Type,
                    title: initialSchool.cn.Title,
                },
                gpa: initialSchool.GPA,
                present: initialSchool.Present,
                logo: null,
                startDate: toDateFromTimestamp(initialSchool.StartDate),
                endDate: toDateFromTimestamp(initialSchool.EndDate),
            });
            form.resetDirty();
            form.clearErrors();
            form.resetTouched();
            return;
        }

        form.setValues(getInitialValues());
        form.resetDirty();
        form.clearErrors();
        form.resetTouched();
    }, [form, initialSchool, isEditMode]);

    // submit handler
    const onSubmit = async (values: SubmitHandler) => {
        if (isSaving || readOnly) {
            return;
        }

        setIsSaving(true);

        try {
            const base64Logo = values.logo
                ? await convertFileToBase64(values.logo)
                : isEditMode
                    ? initialSchool?.Logo ?? null
                    : null;

            const targetDocumentId = isEditMode && initialSchool
                ? initialSchool.id
                : generateId(values.en.schoolName);

            const createDate = isEditMode && initialSchool
                ? toDateFromTimestamp(initialSchool.CreateDate) ?? new Date()
                : new Date();

            await saveSchoolDocument(targetDocumentId, {
                en: {
                    SchoolName: values.en.schoolName,
                    Type: values.en.type,
                    Title: values.en.title,
                },
                zh: {
                    SchoolName: values.zh.schoolName,
                    Type: values.zh.type,
                    Title: values.zh.title,
                },
                cn: {
                    SchoolName: values.cn.schoolName,
                    Type: values.cn.type,
                    Title: values.cn.title,
                },
                GPA: values.gpa,
                Logo: base64Logo,
                Present: values.present,
                StartDate: values.startDate ?? new Date(),
                EndDate: values.present ? null : values.endDate,
                CreateDate: createDate,
            });

            form.reset();
            closeModal();
            showNotification(`${t(translationKeys.school)}${t(translationKeys.savedSuccessfully)}`, SuccessNotificationType);
        } catch (error) {
            console.error(`${t(translationKeys.failedToSubmit)}${t(translationKeys.school)}`, error);
            showNotification(`${t(translationKeys.failedToSubmit)}${t(translationKeys.school)}`, ErrorNotificationType);
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
            <form key={"schoolForm"} onSubmit={form.onSubmit(onSubmit)}>
                <DashboardLocaleTextTabs
                    tabsStyles={tabsStyles}
                    t={t}
                    fieldKeys={formWithLanguageFieldKeys as string[]}
                    inputStyles={inputStyles}
                    disabled={isFormDisabled}
                    getInputProps={(path) => form.getInputProps(path)}
                    getFieldLabel={(fieldKey, locale) => `${t(translationKeys[fieldKey as keyof typeof translationKeys])} (${locale})`}
                />
                <NumberInput
                    label={t(translationKeys.score)}
                    withAsterisk
                    styles={numberInputStyles}
                    value={form.values.gpa}
                    onChange={(value) => form.setFieldValue('gpa', toNumberOrZero(value))}
                    onBlur={() => form.validateField('gpa')}
                    error={form.errors.gpa}
                    disabled={isFormDisabled}
                    className="pt-2"
                    min={0}
                />
                <DashboardDateRangeFields
                    inputStyles={inputStyles}
                    isSaving={isSaving}
                    disabled={readOnly}
                    present={form.values.present}
                    startDate={form.values.startDate}
                    endDate={form.values.endDate}
                    onStartDateChange={(value) => form.setFieldValue('startDate', toDateOrNull(value))}
                    onEndDateChange={(value) => form.setFieldValue('endDate', toDateOrNull(value))}
                    onStartDateBlur={() => form.validateField('startDate')}
                    onEndDateBlur={() => form.validateField('endDate')}
                    startDateError={form.errors.startDate}
                    endDateError={form.errors.endDate}
                    startDateLabel={t(translationKeys.startDate)}
                    endDateLabel={t(translationKeys.endDate)}
                />
                <DashboardImageFileInput
                    inputStyles={inputStyles}
                    componentKey={form.key('logo')}
                    disabled={isFormDisabled}
                    inputProps={form.getInputProps('logo')}
                    label={t(translationKeys.uploadFile)}
                />
                {(initialSchool?.Logo || form.values.logo) && (
                    <DashboardExistingImagePreview
                        imageSource={form.values.logo ? form.values.logo : normalizeImageSource(initialSchool?.Logo ?? '')}
                        alt="School Logo"
                        label="Logo"
                        isDarkTheme={theme === colorTheme.dark}
                    />
                )}
                <DashboardPresentCheckbox
                    inputStyles={inputStyles}
                    isDarkTheme={theme === colorTheme.dark}
                    componentKey={form.key('present')}
                    disabled={isFormDisabled}
                    inputProps={form.getInputProps('present')}
                    label={t(translationKeys.present)}
                />
                <DashboardSubmitDeleteButtonGroup
                    isSaving={isSaving}
                    disabled={readOnly}
                    idleText={buttonText}
                    deleteText={t(translationKeys.delete)}
                    showDelete={isEditMode}
                    onDeleteClick={onDeleteRequest}
                />
            </form>
        </div>
    );
}

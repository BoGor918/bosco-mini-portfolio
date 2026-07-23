// react
import { useContext, useState } from 'react';
// mantine
import { NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../../globalVariable/Translation';
import { showNotification } from '../../../../globalVariable/Notification';
// util
import { DashboardDateRangeFields, DashboardImageFileInput, DashboardLocaleTextTabs, DashboardModalType, DashboardPresentCheckbox, DashboardSubmitButton, ErrorNotificationType, Locale, SuccessNotificationType, getDashboardInputStyles, getDashboardTabsStyles, useDashboardSavingEffect } from '../util';
import { convertFileToBase64, generateId, toDateOrNull } from '../../../util';
// query
import { saveSchoolDocument } from '../../../../query/SchoolQuery';
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

const toNumberOrZero = (value: string | number) => {
    if (typeof value === 'number') {
        return Number.isNaN(value) ? 0 : value;
    }

    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export default function AddSchoolModalComponent({ closeModal, onSavingChange }: DashboardModalType) {
    // form
    const form = useForm<SubmitHandler>({
        mode: 'controlled',
        initialValues: {
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
        },
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
            logo: (value) => (value === null ? `${t(translationKeys.logo)}${t(translationKeys.isRequired)}` : null),
            startDate: (value) => (value === null ? `${t(translationKeys.startDate)}${t(translationKeys.isRequired)}` : null),
            endDate: (value, values) => {
                if (!values.present && value === null) {
                    return `${t(translationKeys.endDate)}${t(translationKeys.isRequired)}`;
                }
                return null;
            },
        },
    });
    // context
    const { t, theme } = useContext(MapperContext);
    // color theme
    const isDarkTheme = theme === colorTheme.dark;
    const [isSaving, setIsSaving] = useState(false);

    // style list
    const inputStyles = getDashboardInputStyles(isDarkTheme);
    const numberInputStyles = {
        ...inputStyles,
        control: {
            color: isDarkTheme ? '#FFFFFF' : '#0B1A33',
            borderColor: isDarkTheme ? 'rgba(33, 212, 247, 0.45)' : 'rgba(11, 26, 51, 0.25)',
        },
    };
    const tabsStyles = getDashboardTabsStyles(isDarkTheme);

    useDashboardSavingEffect(isSaving, onSavingChange);

    const onSubmit = async (values: SubmitHandler) => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const base64Logo = values.logo ? await convertFileToBase64(values.logo) : null;

            await saveSchoolDocument(generateId(values.en.schoolName), {
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
                CreateDate: new Date(),
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
        <div>
            {/* form */}
            <form key={"schoolForm"} onSubmit={form.onSubmit(onSubmit)}>
                <DashboardLocaleTextTabs
                    tabsStyles={tabsStyles}
                    fieldKeys={formWithLanguageFieldKeys as string[]}
                    inputStyles={inputStyles}
                    disabled={isSaving}
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
                    disabled={isSaving}
                    className="pt-2"
                    min={0}
                />
                <DashboardDateRangeFields
                    inputStyles={inputStyles}
                    isSaving={isSaving}
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
                    disabled={isSaving}
                    inputProps={form.getInputProps('logo')}
                    label={t(translationKeys.uploadFile)}
                />
                <DashboardPresentCheckbox
                    inputStyles={inputStyles}
                    componentKey={form.key('present')}
                    disabled={isSaving}
                    inputProps={form.getInputProps('present')}
                    label={t(translationKeys.present)}
                />
                <DashboardSubmitButton isSaving={isSaving} />
            </form>
        </div>
    );
}

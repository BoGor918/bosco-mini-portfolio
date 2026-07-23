// react
import { useContext, useEffect, useState } from 'react';
// mantine
import { Button, Group, TextInput, Tabs, Checkbox, FileInput, NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../../globalVariable/Translation';
import { showNotification } from '../../../../globalVariable/Notification';
// util
import { DashboardModalType, Locale, getDashboardInputStyles, getDashboardTabsStyles, localeTabs } from '../util';
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
                schoolName: (value) => (value.trim().length === 0 ? 'School name is required' : null),
                type: (value) => (value.trim().length === 0 ? 'Type is required' : null),
                title: (value) => (value.trim().length === 0 ? 'Title is required' : null),
            },
            zh: {
                schoolName: (value) => (value.trim().length === 0 ? 'School name is required' : null),
                type: (value) => (value.trim().length === 0 ? 'Type is required' : null),
                title: (value) => (value.trim().length === 0 ? 'Title is required' : null),
            },
            cn: {
                schoolName: (value) => (value.trim().length === 0 ? 'School name is required' : null),
                type: (value) => (value.trim().length === 0 ? 'Type is required' : null),
                title: (value) => (value.trim().length === 0 ? 'Title is required' : null),
            },
            logo: (value) => (value === null ? 'Logo is required' : null),
            startDate: (value) => (value === null ? 'Start date is required' : null),
            endDate: (value, values) => {
                if (!values.present && value === null) {
                    return 'End date is required';
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

    useEffect(() => {
        onSavingChange?.(isSaving);
    }, [isSaving, onSavingChange]);

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
            showNotification('School saved successfully.', 'success');
        } catch (error) {
            console.error('Failed to submit school:', error);
            showNotification("Failed to submit school.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const renderTabPanel = (locale: Locale) => (
        <Tabs.Panel value={locale}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-2">
                {formWithLanguageFieldKeys.map((fieldKey, index) => {
                    const formPath = `${locale}.${fieldKey}` as const;
                    const isLastOddField = formWithLanguageFieldKeys.length % 2 !== 0 && index === formWithLanguageFieldKeys.length - 1;

                    return (
                        <TextInput
                            key={formPath}
                            className={`w-full ${isLastOddField ? 'md:col-span-2' : ''}`}
                            withAsterisk
                            label={`${t(translationKeys[fieldKey])} (${locale})`}
                            styles={inputStyles}
                            {...form.getInputProps(formPath)}
                            disabled={isSaving}
                        />
                    );
                })}
            </div>
        </Tabs.Panel>
    );

    return (
        <div>
            {/* form */}
            <form key={"schoolForm"} onSubmit={form.onSubmit(onSubmit)}>
                <Tabs variant="outline" defaultValue="en" styles={tabsStyles}>
                    <Tabs.List>
                        {localeTabs.map(({ value, label }) => (
                            <Tabs.Tab key={value} value={value}>
                                {label}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                    {localeTabs.map(({ value }) => renderTabPanel(value))}
                </Tabs>
                <NumberInput
                    label="GPA"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:pt-2 lg:pt-2">
                    <DateInput
                        label="Start Date"
                        styles={inputStyles}
                        className="pt-2 md:pt-0 lg:pt-0"
                        value={form.values.startDate}
                        onChange={(value) => form.setFieldValue('startDate', toDateOrNull(value))}
                        onBlur={() => form.validateField('startDate')}
                        error={form.errors.startDate}
                        disabled={isSaving}
                        clearable
                        maxDate={form.values.endDate || undefined}
                    />
                    <DateInput
                        label="End Date"
                        styles={inputStyles}
                        value={form.values.endDate}
                        onChange={(value) => form.setFieldValue('endDate', toDateOrNull(value))}
                        onBlur={() => form.validateField('endDate')}
                        error={form.errors.endDate}
                        disabled={isSaving || form.values.present}
                        minDate={form.values.startDate || undefined}
                        clearable
                    />
                </div>
                <FileInput
                    accept="image/png,image/jpeg"
                    label="Upload files"
                    placeholder="Upload files"
                    styles={inputStyles}
                    key={form.key('logo')}
                    className="pt-2"
                    disabled={isSaving}
                    {...form.getInputProps('logo')}
                />
                <Checkbox
                    label="Present"
                    className="pt-4"
                    styles={inputStyles}
                    key={form.key('present')}
                    disabled={isSaving}
                    {...form.getInputProps('present')}
                />
                <Group justify="space-between" mt="md">
                    <Button type="submit" disabled={isSaving}>
                        Submit
                    </Button>
                </Group>
            </form>
        </div>
    );
}

// react
import { useContext, useEffect, useState } from 'react';
// mantine
import { Button, Group, TextInput, Tabs, MultiSelect, Checkbox, FileInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../../globalVariable/Translation';
import { showNotification } from '../../../../globalVariable/Notification';
// util
import { convertFileToBase64, generateId, toDateOrNull } from '../../../util';
import { DashboardModalType, Locale, getDashboardInputStyles, getDashboardTabsStyles, localeTabs } from '../util';
// query
import { saveCompanyDocument } from '../../../../query/CompanyQuery';

type CompanyFormFields = {
    companyName: string;
    team: string;
    position: string;
    jobDutie: string;
    project: string;
};

type SubmitHandler = Record<Locale, CompanyFormFields> & {
    skillSets: string[];
    present: boolean;
    logo: File | null;
    startDate: Date | null;
    endDate: Date | null;
};

const formWithLanguageFieldKeys: Array<keyof CompanyFormFields> = [
    'companyName',
    'team',
    'position',
    'jobDutie',
    'project',
];

export default function AddCompanyModalComponent({ closeModal, onSavingChange }: DashboardModalType) {
    // form
    const form = useForm<SubmitHandler>({
        mode: 'controlled',
        initialValues: {
            en: {
                companyName: '',
                team: '',
                position: '',
                jobDutie: '',
                project: '',
            },
            zh: {
                companyName: '',
                team: '',
                position: '',
                jobDutie: '',
                project: '',
            },
            cn: {
                companyName: '',
                team: '',
                position: '',
                jobDutie: '',
                project: '',
            },
            skillSets: [],
            present: false,
            logo: null,
            startDate: null,
            endDate: null,
        },
        validate: {
            en: {
                companyName: (value) => (value.trim().length === 0 ? 'Company name is required' : null),
                team: (value) => (value.trim().length === 0 ? 'Team is required' : null),
                position: (value) => (value.trim().length === 0 ? 'Position is required' : null),
                jobDutie: (value) => (value.trim().length === 0 ? 'Job duties are required' : null),
                project: (value) => (value.trim().length === 0 ? 'Project is required' : null),
            },
            zh: {
                companyName: (value) => (value.trim().length === 0 ? 'Company name is required' : null),
                team: (value) => (value.trim().length === 0 ? 'Team is required' : null),
                position: (value) => (value.trim().length === 0 ? 'Position is required' : null),
                jobDutie: (value) => (value.trim().length === 0 ? 'Job duties are required' : null),
                project: (value) => (value.trim().length === 0 ? 'Project is required' : null),
            },
            cn: {
                companyName: (value) => (value.trim().length === 0 ? 'Company name is required' : null),
                team: (value) => (value.trim().length === 0 ? 'Team is required' : null),
                position: (value) => (value.trim().length === 0 ? 'Position is required' : null),
                jobDutie: (value) => (value.trim().length === 0 ? 'Job duties are required' : null),
                project: (value) => (value.trim().length === 0 ? 'Project is required' : null),
            },
            skillSets: (value) => (value.length === 0 ? 'At least one skill is required' : null),
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
    const { t, theme, skillData } = useContext(MapperContext);
    // color theme
    const isDarkTheme = theme === colorTheme.dark;
    const [isSaving, setIsSaving] = useState(false);

    // style list
    const inputStyles = getDashboardInputStyles(isDarkTheme);
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

            await saveCompanyDocument(generateId(values.en.companyName), {
                en: {
                    CompanyName: values.en.companyName,
                    Team: values.en.team,
                    Position: values.en.position,
                    JobDuties: values.en.jobDutie,
                    Projects: values.en.project,
                },
                zh: {
                    CompanyName: values.zh.companyName,
                    Team: values.zh.team,
                    Position: values.zh.position,
                    JobDuties: values.zh.jobDutie,
                    Projects: values.zh.project,
                },
                cn: {
                    CompanyName: values.cn.companyName,
                    Team: values.cn.team,
                    Position: values.cn.position,
                    JobDuties: values.cn.jobDutie,
                    Projects: values.cn.project,
                },
                Logo: base64Logo,
                SkillSets: values.skillSets,
                Present: values.present,
                StartDate: values.startDate ?? new Date(),
                EndDate: values.present ? null : values.endDate,
                CreateDate: new Date(),
            });

            form.reset();
            closeModal();
            showNotification('Company saved successfully.', 'success');
        } catch (error) {
            console.error('Failed to submit company:', error);
            showNotification("Failed to submit company.", 'error');
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
            <form key={"companyForm"} onSubmit={form.onSubmit(onSubmit)}>
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
                <MultiSelect
                    label="Skill(s)"
                    data={skillData.map(skill => skill.SkillName)}
                    clearable
                    searchable
                    styles={inputStyles}
                    className="mt-2"
                    disabled={isSaving}
                    key={form.key('skillSets')}
                    {...form.getInputProps('skillSets')}
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
                        maxDate={form.values.endDate || undefined}
                        clearable
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

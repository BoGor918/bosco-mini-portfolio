// react
import { useContext, useState } from 'react';
// mantine
import { MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../../globalVariable/Translation';
import { showNotification } from '../../../../globalVariable/Notification';
// util
import { convertFileToBase64, generateId, toDateOrNull } from '../../../util';
import { SuccessNotificationType, ErrorNotificationType, DashboardDateRangeFields, DashboardImageFileInput, DashboardLocaleTextTabs, DashboardModalType, DashboardPresentCheckbox, DashboardSubmitButton, Locale, getDashboardInputStyles, getDashboardTabsStyles, useDashboardSavingEffect } from '../util';
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
    // context
    const { t, theme, skillData } = useContext(MapperContext);
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
                companyName: (value) => (value.trim().length === 0 ? `${t(translationKeys.companyName)}${t(translationKeys.isRequired)}` : null),
                team: (value) => (value.trim().length === 0 ? `${t(translationKeys.team)}${t(translationKeys.isRequired)}` : null),
                position: (value) => (value.trim().length === 0 ? `${t(translationKeys.position)}${t(translationKeys.isRequired)}` : null),
                jobDutie: (value) => (value.trim().length === 0 ? `${t(translationKeys.jobDutie)}${t(translationKeys.isRequired)}` : null),
                project: (value) => (value.trim().length === 0 ? `${t(translationKeys.projectName)}${t(translationKeys.isRequired)}` : null),
            },
            zh: {
                companyName: (value) => (value.trim().length === 0 ? `${t(translationKeys.companyName)}${t(translationKeys.isRequired)}` : null),
                team: (value) => (value.trim().length === 0 ? `${t(translationKeys.team)}${t(translationKeys.isRequired)}` : null),
                position: (value) => (value.trim().length === 0 ? `${t(translationKeys.position)}${t(translationKeys.isRequired)}` : null),
                jobDutie: (value) => (value.trim().length === 0 ? `${t(translationKeys.jobDutie)}${t(translationKeys.isRequired)}` : null),
                project: (value) => (value.trim().length === 0 ? `${t(translationKeys.projectName)}${t(translationKeys.isRequired)}` : null),
            },
            cn: {
                companyName: (value) => (value.trim().length === 0 ? `${t(translationKeys.companyName)}${t(translationKeys.isRequired)}` : null),
                team: (value) => (value.trim().length === 0 ? `${t(translationKeys.team)}${t(translationKeys.isRequired)}` : null),
                position: (value) => (value.trim().length === 0 ? `${t(translationKeys.position)}${t(translationKeys.isRequired)}` : null),
                jobDutie: (value) => (value.trim().length === 0 ? `${t(translationKeys.jobDutie)}${t(translationKeys.isRequired)}` : null),
                project: (value) => (value.trim().length === 0 ? `${t(translationKeys.projectName)}${t(translationKeys.isRequired)}` : null),
            },
            skillSets: (value) => (value.length === 0 ? `${t(translationKeys.atLeastOneSkill)}${t(translationKeys.isRequired)}` : null),
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
            showNotification(`${t(translationKeys.company)}${t(translationKeys.savedSuccessfully)}`, SuccessNotificationType);
        } catch (error) {
            console.error(`${t(translationKeys.failedToSubmit)}${t(translationKeys.company)}`, error);
            showNotification(`${t(translationKeys.failedToSubmit)}${t(translationKeys.company)}`, ErrorNotificationType);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            {/* form */}
            <form key={"companyForm"} onSubmit={form.onSubmit(onSubmit)}>
                <DashboardLocaleTextTabs
                    tabsStyles={tabsStyles}
                    fieldKeys={formWithLanguageFieldKeys as string[]}
                    inputStyles={inputStyles}
                    disabled={isSaving}
                    getInputProps={(path) => form.getInputProps(path)}
                    getFieldLabel={(fieldKey, locale) => `${t(translationKeys[fieldKey as keyof typeof translationKeys])} (${locale})`}
                />
                <MultiSelect
                    withAsterisk
                    label={`${t(translationKeys.skill)}`}
                    data={skillData.map(skill => skill.SkillName)}
                    clearable
                    searchable
                    styles={inputStyles}
                    className="mt-2"
                    disabled={isSaving}
                    key={form.key('skillSets')}
                    {...form.getInputProps('skillSets')}
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

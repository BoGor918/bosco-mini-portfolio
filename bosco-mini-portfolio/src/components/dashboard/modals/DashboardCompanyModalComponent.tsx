// react
import { useContext, useEffect, useRef, useState } from 'react';
// mantine
import { LoadingOverlay, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { color, colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../globalVariable/Translation';
import { showNotification } from '../../../globalVariable/Notification';
// util
import { convertFileToBase64, generateId, normalizeImageSource, toDateOrNull } from '../../util';
import { SuccessNotificationType, ErrorNotificationType, DashboardDateRangeFields, DashboardExistingImagePreview, DashboardImageFileInput, DashboardLocaleTextTabs, DashboardModalType, DashboardPresentCheckbox, DashboardSubmitDeleteButtonGroup, Locale, getDashboardInputStyles, getDashboardTabsStyles, useDashboardSavingEffect, toDateFromTimestamp } from './util';
// query
import { saveCompanyDocument } from '../../../query/CompanyQuery';
// type
import { CompanyData } from '../../../types/type';

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

type CompanyModalMode = 'create' | 'edit';

type CompanyModalProps = DashboardModalType & {
    mode?: CompanyModalMode;
    initialCompany?: CompanyData | null;
    onDeleteRequest?: () => void;
};

const getInitialValues = (): SubmitHandler => ({
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
});

export default function DashboardCompanyModalComponent({
    closeModal,
    onSavingChange,
    onDirtyChange,
    readOnly = false,
    mode = 'create',
    initialCompany = null,
    onDeleteRequest,
}: CompanyModalProps) {
    // context
    const { t, theme, skillData } = useContext(MapperContext);
    // modal mode
    const isEditMode = mode === 'edit' && initialCompany !== null;
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
            logo: (value) => {
                if (value !== null) {
                    return null;
                }
                if (isEditMode && initialCompany?.Logo) {
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
        const hydrationKey = isEditMode && initialCompany ? `edit:${initialCompany.id}` : 'create';

        if (hydratedFormKeyRef.current === hydrationKey) {
            return;
        }

        hydratedFormKeyRef.current = hydrationKey;

        if (isEditMode && initialCompany) {
            form.setValues({
                en: {
                    companyName: initialCompany.en.CompanyName,
                    team: initialCompany.en.Team,
                    position: initialCompany.en.Position,
                    jobDutie: initialCompany.en.JobDuties,
                    project: initialCompany.en.Projects,
                },
                zh: {
                    companyName: initialCompany.zh.CompanyName,
                    team: initialCompany.zh.Team,
                    position: initialCompany.zh.Position,
                    jobDutie: initialCompany.zh.JobDuties,
                    project: initialCompany.zh.Projects,
                },
                cn: {
                    companyName: initialCompany.cn.CompanyName,
                    team: initialCompany.cn.Team,
                    position: initialCompany.cn.Position,
                    jobDutie: initialCompany.cn.JobDuties,
                    project: initialCompany.cn.Projects,
                },
                skillSets: initialCompany.SkillSets,
                present: initialCompany.Present,
                logo: null,
                startDate: toDateFromTimestamp(initialCompany.StartDate),
                endDate: toDateFromTimestamp(initialCompany.EndDate),
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
    }, [form, initialCompany, isEditMode]);

    // submit handler
    const onSubmit = async (values: SubmitHandler) => {
        console.log(values)
        if (isSaving || readOnly) {
            return;
        }

        setShowValidationHint(false);
        setIsSaving(true);

        try {
            const base64Logo = values.logo
                ? await convertFileToBase64(values.logo)
                : isEditMode
                    ? initialCompany?.Logo ?? null
                    : null;

            const targetDocumentId = isEditMode && initialCompany
                ? initialCompany.id
                : generateId(values.en.companyName);

            const createDate = isEditMode && initialCompany
                ? toDateFromTimestamp(initialCompany.CreateDate) ?? new Date()
                : new Date();

            await saveCompanyDocument(targetDocumentId, {
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
                CreateDate: createDate,
            });

            form.reset();
            setShowValidationHint(false);
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
        <div className="relative">
            <LoadingOverlay
                visible={isSaving}
                zIndex={1000}
                overlayProps={{
                    radius: 'sm',
                    blur: 1.5,
                    backgroundOpacity: 0.35,
                    color: theme === colorTheme.dark ? color.darkBlue : color.slate500,
                }}
            />
            {/* form */}
            <form
                key={"companyForm"}
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
                <MultiSelect
                    withAsterisk
                    label={`${t(translationKeys.skill)}`}
                    data={skillData.map(skill => skill.SkillName)}
                    clearable
                    searchable
                    styles={inputStyles}
                    className="mt-2"
                    disabled={isFormDisabled}
                    key={form.key('skillSets')}
                    {...form.getInputProps('skillSets')}
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
                {/* display image */}
                {(initialCompany?.Logo || form.values.logo) && (
                    <DashboardExistingImagePreview
                        imageSource={form.values.logo ? form.values.logo : normalizeImageSource(initialCompany?.Logo ?? '')}
                        alt="Company Logo"
                        label="Logo"
                        isDarkTheme={theme === colorTheme.dark}
                    />
                )}
                <DashboardPresentCheckbox
                    inputStyles={inputStyles}
                    isDarkTheme={theme === colorTheme.dark}
                    componentKey={form.key('present')}
                    disabled={isFormDisabled}
                    inputProps={form.getInputProps('present', { type: 'checkbox' })}
                    label={t(translationKeys.present)}
                />
                <DashboardSubmitDeleteButtonGroup
                    isSaving={isSaving}
                    disabled={readOnly}
                    idleText={buttonText}
                    deleteText={t(translationKeys.delete)}
                    showDelete={isEditMode}
                    onDeleteClick={onDeleteRequest}
                    validationMessage={showValidationHint ? t(translationKeys.pleaseFixHighlightedErrors) : undefined}
                    theme={theme}
                />
            </form>
        </div>
    );
}

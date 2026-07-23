// react
import { useContext, useEffect, useState } from 'react';
// mantine
import { Button, Group, TextInput, Tabs, MultiSelect, FileInput, TagsInput } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../globalVariable/Translation';
import { showNotification } from '../../../globalVariable/Notification';
import { convertFileToBase64, generateId } from '../../util';
import { saveProjectDocument } from '../../../query/ProjectQuery';

// form submit handler type
type Locale = 'en' | 'zh' | 'cn';

type ProjectFormFields = {
    description: string;
};

type SubmitHandler = Record<Locale, ProjectFormFields> & {
    projectName: string;
    techStack: string[],
    link: string[],
    logo: File | null,
};

type AddProjectModalContentProps = {
    closeModal: () => void;
    onSavingChange?: (isSaving: boolean) => void;
};

const localeTabs: Array<{ value: Locale; label: string }> = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: 'Traditional Chinese' },
    { value: 'cn', label: 'Simplified Chinese' },
];

const formWithLanguageFieldKeys: Array<keyof ProjectFormFields> = [
    'description',
];

export default function AddProjectModalContent({ closeModal, onSavingChange }: AddProjectModalContentProps) {
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
                description: (value) => (value.trim().length === 0 ? 'Description is required' : null),
            },
            zh: {
                description: (value) => (value.trim().length === 0 ? 'Description is required' : null),
            },
            cn: {
                description: (value) => (value.trim().length === 0 ? 'Description is required' : null),
            },
            projectName: (value) => (value.trim().length === 0 ? 'Project name is required' : null),
            techStack: (value) => (value.length === 0 ? 'At least one tech stack is required' : null),
            link: (value) => (value.length === 0 ? 'At least one link is required' : null),
            logo: (value) => (value === null ? 'Logo is required' : null),
        },
    });
    // context
    const { t, theme, skillData } = useContext(MapperContext);
    // color theme
    const isDarkTheme = theme === colorTheme.dark;
    const [isSaving, setIsSaving] = useState(false);

    // style list
    const inputStyles = {
        label: {
            color: isDarkTheme ? '#FFFFFF' : '#334155',
            fontWeight: 600,
            fontSize: '14px',
        },
        input: {
            backgroundColor: isDarkTheme ? '#102340' : '#FFFFFF',
            color: isDarkTheme ? '#FFFFFF' : '#0B1A33',
            borderColor: isDarkTheme ? 'rgba(33, 212, 247, 0.45)' : 'rgba(11, 26, 51, 0.25)',
            fontSize: '14px',
        },
    };
    const tabsStyles = {
        tab: {
            color: isDarkTheme ? '#FFFFFF' : '#334155',
        },
    };

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
            showNotification('Project saved successfully.', 'success');
        } catch (error) {
            console.error('Failed to submit project:', error);
            showNotification("Failed to submit project.", 'error');
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
            <form key={"projectForm"} onSubmit={form.onSubmit(onSubmit)}>
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
                    label="Tech Stack(s)"
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
                    label="Link(s)"
                    styles={inputStyles}
                    className="mt-2"
                    disabled={isSaving}
                    clearable
                    acceptValueOnBlur
                    splitChars={[',']}
                    key={form.key('link')}
                    {...form.getInputProps('link')}
                />
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
                <Group justify="space-between" mt="md">
                    <Button type="submit" disabled={isSaving}>
                        Submit
                    </Button>
                </Group>
            </form>
        </div>
    );
}

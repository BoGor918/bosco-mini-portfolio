// react
import { useContext, useEffect, useState } from 'react';
// mantine
import { Button, Group, TextInput, FileInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { showNotification } from '../../../globalVariable/Notification';
import { translationKeys } from '../../../globalVariable/Translation';
import { saveSkillDocument } from '../../../query/skill/SkillQuery';
import { convertFileToBase64, generateId } from '../util';

type AddSkillModalContentProps = {
    closeModal: () => void;
    onSavingChange?: (isSaving: boolean) => void;
};

type SkillFormFields = {
    skillName: string;
    logo: File | null;
};

type SubmitHandler = SkillFormFields;

export default function AddSkillModalContent({ closeModal, onSavingChange }: AddSkillModalContentProps) {
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        onSavingChange?.(isSaving);
    }, [isSaving, onSavingChange]);

    // form
    const form = useForm<SubmitHandler>({
        mode: 'uncontrolled',
        initialValues: {
            skillName: '',
            logo: null,
        },
        validate: {
            skillName: (value) => (value.trim().length === 0 ? 'Skill name is required' : null),
            logo: (value) => (value === null ? 'Logo is required' : null),
        },
    });
    // context
    const { t, theme } = useContext(MapperContext);
    // color theme
    const isDarkTheme = theme === colorTheme.dark;

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

    const onSubmit = async (values: SubmitHandler) => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const base64Logo = values.logo ? await convertFileToBase64(values.logo) : null;

            await saveSkillDocument(generateId(values.skillName), {
                SkillName: values.skillName,
                Logo: base64Logo,
                CreateDate: new Date(),
            });

            form.reset();
            closeModal();
            showNotification('Skill saved successfully.', 'success');
        } catch (error) {
            console.error('Failed to submit skill:', error);
            showNotification("Failed to submit skill.", 'error');
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
                    color: isDarkTheme ? '#0B1A33' : '#334155',
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
                    <Button type="submit" loading={isSaving} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Submit'}
                    </Button>
                </Group>
            </form>
        </div>
    );
}

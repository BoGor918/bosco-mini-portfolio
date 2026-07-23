// react
import { useEffect } from 'react';
import type { ReactNode } from 'react';
// mantine
import { Button, Checkbox, FileInput, Group, Tabs, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';

export const SuccessNotificationType = "success";
export const ErrorNotificationType = "error";

export type DashboardModalType = {
    closeModal: () => void;
    onSavingChange?: (isSaving: boolean) => void;
};

type DashboardSubmitButtonProps = {
    isSaving: boolean;
    showLoading?: boolean;
    idleText?: string;
    savingText?: string;
};

type DashboardLocaleTextTabsProps = {
    tabsStyles: any;
    fieldKeys: string[];
    inputStyles: any;
    disabled: boolean;
    getInputProps: (path: string) => any;
    getFieldLabel: (fieldKey: string, locale: Locale) => string;
};

type DashboardImageFileInputProps = {
    inputStyles: any;
    disabled: boolean;
    inputProps: any;
    componentKey?: string;
    className?: string;
    label?: string;
    placeholder?: string;
};

type DashboardPresentCheckboxProps = {
    inputStyles: any;
    disabled: boolean;
    inputProps: any;
    componentKey?: string;
    className?: string;
    label?: string;
};

type DashboardDateRangeFieldsProps = {
    inputStyles: any;
    isSaving: boolean;
    present: boolean;
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (value: Date | string | null) => void;
    onEndDateChange: (value: Date | string | null) => void;
    onStartDateBlur: () => void;
    onEndDateBlur: () => void;
    startDateError?: ReactNode;
    endDateError?: ReactNode;
    startDateLabel?: string;
    endDateLabel?: string;
};

export type Locale = 'en' | 'zh' | 'cn';

export const localeTabs: Array<{ value: Locale; label: string }> = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: 'Traditional Chinese' },
    { value: 'cn', label: 'Simplified Chinese' },
];

export const getDashboardInputStyles = (isDarkTheme: boolean) => ({
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
});

export const getDashboardTabsStyles = (isDarkTheme: boolean) => ({
    tab: {
        color: isDarkTheme ? '#FFFFFF' : '#334155',
    },
});

export const useDashboardSavingEffect = (
    isSaving: boolean,
    onSavingChange?: (isSaving: boolean) => void,
) => {
    useEffect(() => {
        onSavingChange?.(isSaving);
    }, [isSaving, onSavingChange]);
};

export function DashboardSubmitButton({
    isSaving,
    showLoading = false,
    idleText = 'Submit',
    savingText = 'Saving...',
}: DashboardSubmitButtonProps) {
    return (
        <Group justify="space-between" mt="md">
            <Button type="submit" disabled={isSaving} loading={showLoading && isSaving}>
                {showLoading ? (isSaving ? savingText : idleText) : idleText}
            </Button>
        </Group>
    );
}

export function DashboardLocaleTextTabs({
    tabsStyles,
    fieldKeys,
    inputStyles,
    disabled,
    getInputProps,
    getFieldLabel,
}: DashboardLocaleTextTabsProps) {
    return (
        <Tabs variant="outline" defaultValue="en" styles={tabsStyles}>
            <Tabs.List>
                {localeTabs.map(({ value, label }) => (
                    <Tabs.Tab key={value} value={value}>
                        {label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            {localeTabs.map(({ value: locale }) => (
                <Tabs.Panel key={locale} value={locale}>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-2">
                        {fieldKeys.map((fieldKey, index) => {
                            const formPath = `${locale}.${fieldKey}`;
                            const isLastOddField = fieldKeys.length % 2 !== 0 && index === fieldKeys.length - 1;

                            return (
                                <TextInput
                                    key={formPath}
                                    className={`w-full ${isLastOddField ? 'md:col-span-2' : ''}`}
                                    withAsterisk
                                    label={getFieldLabel(fieldKey, locale)}
                                    styles={inputStyles}
                                    {...getInputProps(formPath)}
                                    disabled={disabled}
                                />
                            );
                        })}
                    </div>
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}

export function DashboardImageFileInput({
    inputStyles,
    disabled,
    inputProps,
    componentKey,
    className = 'pt-2',
    label = 'Upload file',
}: DashboardImageFileInputProps) {
    return (
        <FileInput
            withAsterisk
            accept="image/png,image/jpeg"
            label={label}
            styles={inputStyles}
            key={componentKey}
            className={className}
            disabled={disabled}
            {...inputProps}
        />
    );
}

export function DashboardPresentCheckbox({
    inputStyles,
    disabled,
    inputProps,
    componentKey,
    className = 'pt-4',
    label = 'Present',
}: DashboardPresentCheckboxProps) {
    return (
        <Checkbox
            label={label}
            className={className}
            styles={inputStyles}
            key={componentKey}
            disabled={disabled}
            {...inputProps}
        />
    );
}

export function DashboardDateRangeFields({
    inputStyles,
    isSaving,
    present,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onStartDateBlur,
    onEndDateBlur,
    startDateError,
    endDateError,
    startDateLabel = 'Start Date',
    endDateLabel = 'End Date',
}: DashboardDateRangeFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:pt-2 lg:pt-2">
            <DateInput
                withAsterisk
                label={startDateLabel}
                styles={inputStyles}
                className="pt-2 md:pt-0 lg:pt-0"
                value={startDate}
                onChange={onStartDateChange}
                onBlur={onStartDateBlur}
                error={startDateError}
                disabled={isSaving}
                maxDate={endDate || undefined}
                clearable
            />
            <DateInput
                withAsterisk
                label={endDateLabel}
                styles={inputStyles}
                value={endDate}
                onChange={onEndDateChange}
                onBlur={onEndDateBlur}
                error={endDateError}
                disabled={isSaving || present}
                minDate={startDate || undefined}
                clearable
            />
        </div>
    );
}